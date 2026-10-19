import type { Config, Context } from '@netlify/functions';
import { db } from '../../db/index.js';
import {
  users,
  sessions,
  issues,
  conversations,
  messages,
  troubleshooting_steps,
  tickets,
  knowledge_base,
  feedback
} from '../../db/schema.js';
import { eq, asc, desc, and, inArray, sql } from 'drizzle-orm';
import { classifyProblem } from '../../backend/rule_classifier.ts';
import { getAllKBEntries, getKBEntryById } from '../../backend/knowledge_base.ts';
import { startDiagnosisSession, evaluateStepResponse } from '../../backend/decision_engine.ts';
import { generateSupportTicket } from '../../backend/ticket_generator.ts';
import { registerUser, loginUser, getUserByToken, logoutUser } from '../../backend/auth.ts';
import { ensureSeeded } from '../../backend/seed.ts';

type JsonBody = Record<string, any>;

async function readBody(req: Request): Promise<JsonBody> {
  try {
    return (await req.json()) as JsonBody;
  } catch {
    return {};
  }
}

async function getRequestUser(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = await getUserByToken(token);
    if (user) return user;
  }

  // Return standard demo user if not logged in
  const rows = await db.select().from(users).where(eq(users.id, 'user_student_demo')).limit(1);
  const defaultUser = rows[0];
  if (defaultUser) {
    return {
      id: defaultUser.id,
      email: defaultUser.email,
      name: defaultUser.name,
      role: defaultUser.role,
      createdAt: defaultUser.created_at
    };
  }
  return {
    id: 'user_student_demo',
    email: 'student@techassist.ai',
    name: 'CSE Engineer User',
    role: 'engineer',
    createdAt: new Date().toISOString()
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function errorJson(message: string, status = 500): Response {
  return json({ error: message }, status);
}

async function handleApi(req: Request, _context: Context): Promise<Response> {
  const url = new URL(req.url);
  const segments = url.pathname.replace(/^\/api\//, '').split('/').filter(Boolean);
  const method = req.method;
  const [root, second] = segments;

  // -------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------
  if (root === 'auth') {
    if (second === 'register' && method === 'POST') {
      const body = await readBody(req);
      if (!body.email || !body.password || !body.name) {
        return errorJson('Name, email, and password are required.', 400);
      }
      try {
        const user = await registerUser(body.email, body.name, body.password);
        const { token } = await loginUser(body.email, body.password);
        return json({ user, token });
      } catch (err: any) {
        return errorJson(err.message || 'Registration failed.', 400);
      }
    }

    if (second === 'login' && method === 'POST') {
      const body = await readBody(req);
      if (!body.email || !body.password) {
        return errorJson('Email and password are required.', 400);
      }
      try {
        const result = await loginUser(body.email, body.password);
        return json(result);
      } catch (err: any) {
        return errorJson(err.message || 'Login failed.', 401);
      }
    }

    if (second === 'me' && method === 'GET') {
      const user = await getRequestUser(req);
      return json({ user });
    }

    if (second === 'logout' && method === 'POST') {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await logoutUser(token);
      }
      return json({ success: true });
    }

    return errorJson('Not found', 404);
  }

  // -------------------------------------------------------------
  // DIAGNOSIS & REASONING ROUTES
  // -------------------------------------------------------------
  if (root === 'diagnose') {
    if (second === 'classify' && method === 'POST') {
      const body = await readBody(req);
      if (!body.problemText || typeof body.problemText !== 'string') {
        return errorJson('Problem description text is required.', 400);
      }
      try {
        const result = classifyProblem(body.problemText);
        return json(result);
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second === 'start' && method === 'POST') {
      const body = await readBody(req);
      if (!body.problemText) {
        return errorJson('Problem description is required.', 400);
      }

      try {
        const user = await getRequestUser(req);

        // Classify the problem using RuleClassifier
        const classification = classifyProblem(body.problemText);

        // Check if ambiguous or unknown
        if (classification.needsClarification && !body.manualProblemId) {
          return json({
            needsClarification: true,
            clarificationMessage: classification.clarificationMessage,
            confidence: classification.confidence,
            suggestedCategories: [
              'Network',
              'Hardware',
              'Performance',
              'Browser',
              'Printer',
              'Software',
              'Operating System',
              'Storage'
            ]
          });
        }

        const problemId = body.manualProblemId || classification.problemId || 'wifi-no-internet';
        const category =
          classification.category === 'Ambiguous / Unknown' ? 'General' : classification.category;

        const session = await startDiagnosisSession(
          user.id,
          body.problemText,
          problemId,
          category,
          classification.confidence
        );

        if (!session.isValid) {
          return errorJson(session.error || 'Failed to start diagnostic session.', 400);
        }

        return json({
          needsClarification: false,
          classification,
          session
        });
      } catch (err: any) {
        console.error('[Diagnose Start Error]', err);
        return errorJson('Failed to start diagnostic session: ' + err.message);
      }
    }

    if (second === 'step' && method === 'POST') {
      const body = await readBody(req);
      const { issueId, conversationId, problemId, currentNodeId, response } = body;
      if (!issueId || !conversationId || !problemId || !currentNodeId || !response) {
        return errorJson('Missing required step parameters.', 400);
      }

      try {
        const stepResult = await evaluateStepResponse(issueId, conversationId, problemId, currentNodeId, response);

        if (!stepResult.isValid) {
          return errorJson(stepResult.error || 'Step evaluation failed.', 400);
        }

        // If escalated, automatically generate ticket
        let generatedTicket = null;
        if (stepResult.isEscalated) {
          const user = await getRequestUser(req);
          try {
            generatedTicket = await generateSupportTicket(user.id, issueId, stepResult.escalationReason);
          } catch (e) {
            console.error('[Ticket Auto-Generation Error]', e);
          }
        }

        return json({
          ...stepResult,
          ticket: generatedTicket
        });
      } catch (err: any) {
        console.error('[Diagnose Step Error]', err);
        return errorJson('Failed to process step: ' + err.message);
      }
    }

    if (second === 'escalate' && method === 'POST') {
      const body = await readBody(req);
      if (!body.issueId) {
        return errorJson('Issue ID is required.', 400);
      }
      try {
        const user = await getRequestUser(req);
        const ticket = await generateSupportTicket(user.id, body.issueId, body.customReason);
        return json({ success: true, ticket });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    return errorJson('Not found', 404);
  }

  // -------------------------------------------------------------
  // ISSUES & CONVERSATIONS
  // -------------------------------------------------------------
  if (root === 'issues') {
    if (!second && method === 'GET') {
      try {
        const user = await getRequestUser(req);
        const statusFilter = url.searchParams.get('status');

        const conditions = [eq(issues.user_id, user.id)];
        if (statusFilter && statusFilter !== 'ALL') {
          conditions.push(eq(issues.status, statusFilter));
        }

        const rows = await db
          .select()
          .from(issues)
          .where(and(...conditions))
          .orderBy(desc(issues.created_at));

        return json({ issues: rows });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'GET') {
      try {
        const issueRows = await db.select().from(issues).where(eq(issues.id, second));
        const issue = issueRows[0];
        if (!issue) {
          return errorJson('Issue not found.', 404);
        }

        const steps = await db
          .select()
          .from(troubleshooting_steps)
          .where(eq(troubleshooting_steps.issue_id, second))
          .orderBy(asc(troubleshooting_steps.step_number), asc(troubleshooting_steps.created_at));

        const convRows = await db.select().from(conversations).where(eq(conversations.issue_id, second));

        return json({ issue, steps, conversation: convRows[0] || null });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'DELETE') {
      try {
        await db.delete(issues).where(eq(issues.id, second));
        return json({ success: true });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'PATCH') {
      try {
        const body = await readBody(req);
        const now = new Date().toISOString();
        if (body.status && body.resolution_summary) {
          await db
            .update(issues)
            .set({ status: body.status, resolution_summary: body.resolution_summary, updated_at: now })
            .where(eq(issues.id, second));
        } else if (body.status) {
          await db.update(issues).set({ status: body.status, updated_at: now }).where(eq(issues.id, second));
        }
        return json({ success: true });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    return errorJson('Not found', 404);
  }

  if (root === 'conversations') {
    if (!second && method === 'GET') {
      try {
        const user = await getRequestUser(req);
        const rows = await db
          .select({
            id: conversations.id,
            user_id: conversations.user_id,
            issue_id: conversations.issue_id,
            title: conversations.title,
            status: conversations.status,
            created_at: conversations.created_at,
            updated_at: conversations.updated_at,
            problem_text: issues.problem_text,
            category: issues.category,
            issue_status: issues.status,
            matched_problem_id: issues.matched_problem_id
          })
          .from(conversations)
          .innerJoin(issues, eq(conversations.issue_id, issues.id))
          .where(eq(conversations.user_id, user.id))
          .orderBy(desc(conversations.updated_at));
        return json({ conversations: rows });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && segments[2] === 'messages' && method === 'GET') {
      try {
        const convRows = await db.select().from(conversations).where(eq(conversations.id, second));
        const conversation = convRows[0];
        if (!conversation) {
          return errorJson('Conversation not found.', 404);
        }

        const msgs = await db
          .select()
          .from(messages)
          .where(eq(messages.conversation_id, second))
          .orderBy(asc(messages.created_at));
        const issueRows = await db.select().from(issues).where(eq(issues.id, conversation.issue_id));

        return json({ conversation, issue: issueRows[0] || null, messages: msgs });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    return errorJson('Not found', 404);
  }

  // -------------------------------------------------------------
  // SUPPORT TICKETS
  // -------------------------------------------------------------
  if (root === 'tickets') {
    if (!second && method === 'GET') {
      try {
        const user = await getRequestUser(req);
        const rows = await db
          .select()
          .from(tickets)
          .where(eq(tickets.user_id, user.id))
          .orderBy(desc(tickets.created_at));

        const out = rows.map((r) => ({
          ...r,
          steps_attempted: JSON.parse(r.steps_attempted_json || '[]')
        }));

        return json({ tickets: out });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'GET') {
      try {
        const rows = await db.select().from(tickets).where(eq(tickets.id, second));
        const row = rows[0];
        if (!row) {
          return errorJson('Ticket not found.', 404);
        }
        return json({
          ticket: {
            ...row,
            steps_attempted: JSON.parse(row.steps_attempted_json || '[]')
          }
        });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'PATCH') {
      try {
        const body = await readBody(req);
        if (!body.status) return errorJson('Status is required', 400);
        await db.update(tickets).set({ status: body.status }).where(eq(tickets.id, second));
        return json({ success: true, id: second, status: body.status });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    return errorJson('Not found', 404);
  }

  // -------------------------------------------------------------
  // KNOWLEDGE BASE
  // -------------------------------------------------------------
  if (root === 'knowledge-base') {
    if (!second && method === 'GET') {
      try {
        const entries = await getAllKBEntries();
        return json({ entries });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (!second && method === 'POST') {
      try {
        const body = await readBody(req);
        const { problemId, category, title, severity, symptoms, possibleCauses, nodes } = body;
        if (!problemId || !category || !title || !nodes) {
          return errorJson('Problem ID, category, title, and diagnostic nodes are required.', 400);
        }
        const now = new Date().toISOString();
        await db
          .insert(knowledge_base)
          .values({
            id: `kb_${problemId}`,
            problem_id: problemId,
            category,
            title,
            severity: severity || 'MEDIUM',
            symptoms_json: JSON.stringify(symptoms || []),
            possible_causes_json: JSON.stringify(possibleCauses || []),
            troubleshooting_tree_json: JSON.stringify(nodes || {}),
            created_at: now
          })
          .onConflictDoUpdate({
            target: knowledge_base.problem_id,
            set: {
              category,
              title,
              severity: severity || 'MEDIUM',
              symptoms_json: JSON.stringify(symptoms || []),
              possible_causes_json: JSON.stringify(possibleCauses || []),
              troubleshooting_tree_json: JSON.stringify(nodes || {})
            }
          });
        return json({ success: true, problemId });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    if (second && method === 'GET') {
      try {
        const entry = await getKBEntryById(second);
        if (!entry) {
          return errorJson('Knowledge base entry not found.', 404);
        }
        return json({ entry });
      } catch (err: any) {
        return errorJson(err.message);
      }
    }

    return errorJson('Not found', 404);
  }

  // -------------------------------------------------------------
  // REAL DASHBOARD STATS
  // -------------------------------------------------------------
  if (root === 'dashboard' && second === 'stats' && method === 'GET') {
    try {
      const user = await getRequestUser(req);

      const [activeIssues] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(issues)
        .where(and(eq(issues.user_id, user.id), inArray(issues.status, ['OPEN', 'IN PROGRESS'])));
      const [resolvedIssues] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(issues)
        .where(and(eq(issues.user_id, user.id), eq(issues.status, 'RESOLVED')));
      const [escalatedIssues] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(issues)
        .where(and(eq(issues.user_id, user.id), eq(issues.status, 'ESCALATED')));
      const [openTickets] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(tickets)
        .where(and(eq(tickets.user_id, user.id), eq(tickets.status, 'OPEN')));

      const recentConversations = await db
        .select({
          id: conversations.id,
          title: conversations.title,
          status: conversations.status,
          created_at: conversations.created_at,
          category: issues.category,
          severity: issues.severity
        })
        .from(conversations)
        .innerJoin(issues, eq(conversations.issue_id, issues.id))
        .where(eq(conversations.user_id, user.id))
        .orderBy(desc(conversations.created_at))
        .limit(5);

      const categoryDistribution = await db
        .select({ category: issues.category, count: sql<number>`count(*)::int` })
        .from(issues)
        .where(eq(issues.user_id, user.id))
        .groupBy(issues.category)
        .orderBy(desc(sql`count(*)`));

      return json({
        activeIssues: activeIssues?.count ?? 0,
        resolvedIssues: resolvedIssues?.count ?? 0,
        escalatedIssues: escalatedIssues?.count ?? 0,
        openTickets: openTickets?.count ?? 0,
        recentConversations,
        categoryDistribution
      });
    } catch (err: any) {
      return errorJson(err.message);
    }
  }

  // -------------------------------------------------------------
  // FEEDBACK
  // -------------------------------------------------------------
  if (root === 'feedback' && method === 'POST') {
    try {
      const body = await readBody(req);
      if (!body.issueId || body.rating === undefined) {
        return errorJson('Issue ID and rating are required.', 400);
      }
      const user = await getRequestUser(req);
      await db.insert(feedback).values({
        id: `fb_${Date.now()}`,
        issue_id: body.issueId,
        user_id: user.id,
        rating: body.rating,
        comments: body.comments || '',
        created_at: new Date().toISOString()
      });
      return json({ success: true });
    } catch (err: any) {
      return errorJson(err.message);
    }
  }

  return errorJson('Not found', 404);
}

export default async (req: Request, context: Context) => {
  try {
    await ensureSeeded();
    return await handleApi(req, context);
  } catch (err: any) {
    console.error('[API Fatal Error]', err);
    return errorJson('Internal server error: ' + err.message, 500);
  }
};

export const config: Config = {
  path: '/api/*'
};
