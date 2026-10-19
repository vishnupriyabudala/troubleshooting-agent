import { db } from '../db/index.js';
import { issues, troubleshooting_steps, tickets } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export interface GeneratedTicket {
  id: string;
  issue_id: string;
  user_id: string;
  problem_description: string;
  category: string;
  severity: string;
  priority: string;
  status: string;
  escalation_reason: string;
  steps_attempted: Array<{
    step: number;
    question: string;
    instruction?: string | null;
    userResponse: string;
    outcome?: string | null;
  }>;
  created_at: string;
}

export async function generateSupportTicket(
  userId: string,
  issueId: string,
  customEscalationReason?: string
): Promise<GeneratedTicket> {
  const issueRows = await db.select().from(issues).where(eq(issues.id, issueId));
  const issue = issueRows[0];
  if (!issue) {
    throw new Error(`Issue not found: ${issueId}`);
  }

  // Generate random 5-digit number for ticket ID format TS-2026-XXXXX
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const ticketId = `TS-2026-${randomNum}`;

  // Severity to Priority mapping
  const severity = (issue.severity || 'HIGH').toUpperCase();
  let priority = 'P2 - High';
  if (severity === 'CRITICAL') priority = 'P1 - Critical';
  else if (severity === 'MEDIUM') priority = 'P3 - Normal';
  else if (severity === 'LOW') priority = 'P4 - Low';

  // Retrieve all attempted troubleshooting steps
  const stepsRows = await db
    .select({
      step_number: troubleshooting_steps.step_number,
      question: troubleshooting_steps.question,
      instruction: troubleshooting_steps.instruction,
      user_response: troubleshooting_steps.user_response,
      outcome: troubleshooting_steps.outcome
    })
    .from(troubleshooting_steps)
    .where(eq(troubleshooting_steps.issue_id, issueId))
    .orderBy(asc(troubleshooting_steps.step_number), asc(troubleshooting_steps.created_at));

  const stepsAttempted = stepsRows.map((s, idx) => ({
    step: s.step_number || idx + 1,
    question: s.question,
    instruction: s.instruction,
    userResponse: s.user_response || 'Not answered',
    outcome: s.outcome || 'N/A'
  }));

  const escalationReason =
    customEscalationReason ||
    issue.resolution_summary ||
    'Interactive troubleshooting tree completed without resolution. Transferred to Tier 2 Technical Support Engineering.';

  const now = new Date().toISOString();

  // Save ticket to database
  await db.insert(tickets).values({
    id: ticketId,
    user_id: userId,
    issue_id: issueId,
    problem_description: issue.problem_text,
    category: issue.category,
    severity,
    priority,
    status: 'OPEN',
    escalation_reason: escalationReason,
    steps_attempted_json: JSON.stringify(stepsAttempted),
    created_at: now
  });

  // Update issue status to ESCALATED
  await db
    .update(issues)
    .set({
      status: 'ESCALATED',
      resolution_summary: `Escalated as Support Ticket ${ticketId}: ${escalationReason}`,
      updated_at: now
    })
    .where(eq(issues.id, issueId));

  return {
    id: ticketId,
    issue_id: issueId,
    user_id: userId,
    problem_description: issue.problem_text,
    category: issue.category,
    severity,
    priority,
    status: 'OPEN',
    escalation_reason: escalationReason,
    steps_attempted: stepsAttempted,
    created_at: now
  };
}
