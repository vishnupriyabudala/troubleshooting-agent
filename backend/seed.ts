import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { users, issues, conversations, messages, troubleshooting_steps, tickets, knowledge_base } from '../db/schema.js';
import { sql, eq } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import kbSeedData from '../data/knowledge_base.json';

interface KBSeedEntry {
  problemId: string;
  category: string;
  title: string;
  severity?: string;
  symptoms?: string[];
  possibleCauses?: string[];
  nodes?: Record<string, unknown>;
}

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function countRows(table: PgTable): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(table);
  return row?.count ?? 0;
}

async function runSeed(): Promise<void> {
  // Seed knowledge base from bundled JSON if empty
  const kbCount = await countRows(knowledge_base);
  if (kbCount === 0) {
    const now = new Date().toISOString();
    const entries = kbSeedData as unknown as KBSeedEntry[];
    const values = entries.map((entry) => ({
      id: `kb_${entry.problemId}`,
      problem_id: entry.problemId,
      category: entry.category,
      title: entry.title,
      severity: entry.severity || 'MEDIUM',
      symptoms_json: JSON.stringify(entry.symptoms || []),
      possible_causes_json: JSON.stringify(entry.possibleCauses || []),
      troubleshooting_tree_json: JSON.stringify(entry.nodes || {}),
      created_at: now
    }));
    if (values.length > 0) {
      await db.insert(knowledge_base).values(values).onConflictDoNothing();
    }
  }

  // Seed default engineer/demo account if missing
  const demoUserRows = await db.select({ id: users.id }).from(users).where(eq(users.id, 'user_student_demo'));
  if (demoUserRows.length === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('techassist2026', salt, 64).toString('hex');
    await db
      .insert(users)
      .values({
        id: 'user_student_demo',
        email: 'student@techassist.ai',
        name: 'CSE Engineer User',
        password_hash: `${salt}:${hash}`,
        role: 'engineer',
        created_at: new Date().toISOString()
      })
      .onConflictDoNothing();
  }

  // Seed sample demonstration issues and tickets if missing
  const demoIssueRows = await db.select({ id: issues.id }).from(issues).where(eq(issues.id, 'issue_demo_wifi_resolved'));
  if (demoIssueRows.length === 0) {
    await seedDemoData();
  }
}

async function seedDemoData(): Promise<void> {
  const now = new Date();
  const isoNow = now.toISOString();
  const demoUserId = 'user_student_demo';

  // 1. Resolved Issue: Wi-Fi Connected but No Internet Access
  const issue1Id = 'issue_demo_wifi_resolved';
  const conv1Id = 'conv_demo_wifi_resolved';
  await db
    .insert(issues)
    .values({
      id: issue1Id,
      user_id: demoUserId,
      problem_text: 'My laptop is connected to Wi-Fi but websites will not load or open in browser.',
      category: 'Network',
      matched_problem_id: 'wifi-no-internet',
      confidence: 0.95,
      severity: 'MEDIUM',
      status: 'RESOLVED',
      resolution_summary:
        'Local DNS resolver flushed with ipconfig /flushdns and winsock reset. Internet restored successfully.',
      created_at: new Date(now.getTime() - 3600000 * 2).toISOString(),
      updated_at: new Date(now.getTime() - 3600000).toISOString()
    })
    .onConflictDoNothing();

  await db
    .insert(conversations)
    .values({
      id: conv1Id,
      user_id: demoUserId,
      issue_id: issue1Id,
      title: 'Wi-Fi Connection & DNS Resolution Diagnosis',
      status: 'RESOLVED',
      created_at: new Date(now.getTime() - 3600000 * 2).toISOString(),
      updated_at: new Date(now.getTime() - 3600000).toISOString()
    })
    .onConflictDoNothing();

  await db
    .insert(troubleshooting_steps)
    .values([
      {
        id: 'step_demo_1',
        issue_id: issue1Id,
        step_number: 1,
        node_id: 'start',
        question: 'Can another device connected to the same Wi-Fi access the internet?',
        instruction: 'Test internet connectivity on a second device (phone or tablet).',
        user_response: 'YES',
        outcome: 'Continue diagnosis for local laptop DNS cache issue',
        created_at: new Date(now.getTime() - 3600000 * 2).toISOString()
      },
      {
        id: 'step_demo_2',
        issue_id: issue1Id,
        step_number: 2,
        node_id: 'check-dns-local',
        question: 'After restarting your laptop, can you now load web pages?',
        instruction: 'Flush DNS resolver and reset TCP/IP stack:\nipconfig /flushdns\nnetsh winsock reset',
        user_response: 'YES',
        outcome: 'Resolved: DNS resolver cache cleared and TCP stack reset',
        created_at: new Date(now.getTime() - 3600000).toISOString()
      }
    ])
    .onConflictDoNothing();

  await db
    .insert(messages)
    .values([
      {
        id: 'msg_demo_1',
        conversation_id: conv1Id,
        sender: 'user',
        content: 'My laptop is connected to Wi-Fi but websites will not load or open in browser.',
        metadata_json: JSON.stringify({ category: 'Network', confidence: 0.95 }),
        created_at: new Date(now.getTime() - 3600000 * 2).toISOString()
      },
      {
        id: 'msg_demo_2',
        conversation_id: conv1Id,
        sender: 'agent',
        content:
          'I have classified your problem as **Network**: *Connected to Wi-Fi but No Internet Access*.\n\nLet\'s troubleshoot step-by-step.\n\n**Step 1:** Test internet connectivity on a second device (phone or tablet).\n\n**Question:** Can another device connected to the same Wi-Fi access the internet?',
        metadata_json: JSON.stringify({ nodeId: 'start', stepNumber: 1, options: ['YES', 'NO'] }),
        created_at: new Date(now.getTime() - 3600000 * 2).toISOString()
      }
    ])
    .onConflictDoNothing();

  // 2. Escalated Issue: Laptop Overheating
  const issue2Id = 'issue_demo_overheating_escalated';
  const conv2Id = 'conv_demo_overheating_escalated';
  const ticketId = 'TS-2026-10492';

  await db
    .insert(issues)
    .values({
      id: issue2Id,
      user_id: demoUserId,
      problem_text: 'Laptop chassis is extremely hot, thermal throttling and fan noise very loud.',
      category: 'Hardware',
      matched_problem_id: 'laptop-overheating',
      confidence: 0.92,
      severity: 'HIGH',
      status: 'ESCALATED',
      resolution_summary:
        'Physical inspection confirmed vents are clear and surface is rigid; possible thermal paste degradation or failing fan bearing.',
      created_at: new Date(now.getTime() - 3600000 * 5).toISOString(),
      updated_at: new Date(now.getTime() - 3600000 * 3).toISOString()
    })
    .onConflictDoNothing();

  await db
    .insert(conversations)
    .values({
      id: conv2Id,
      user_id: demoUserId,
      issue_id: issue2Id,
      title: 'Laptop Thermal Throttling & Fan Noise Audit',
      status: 'ESCALATED',
      created_at: new Date(now.getTime() - 3600000 * 5).toISOString(),
      updated_at: new Date(now.getTime() - 3600000 * 3).toISOString()
    })
    .onConflictDoNothing();

  await db
    .insert(tickets)
    .values({
      id: ticketId,
      user_id: demoUserId,
      issue_id: issue2Id,
      problem_description: 'Laptop chassis is extremely hot, thermal throttling and fan noise very loud.',
      category: 'Hardware',
      severity: 'HIGH',
      priority: 'P2 - High',
      status: 'OPEN',
      escalation_reason:
        'Diagnostic steps completed: Laptop tested on hard desk surface, vents physically checked for dust obstructions. Hardware servicing required for thermal compound re-paste.',
      steps_attempted_json: JSON.stringify([
        { step: 1, question: 'Is your laptop placed on a soft surface like a bed?', userResponse: 'HARD DESK' },
        { step: 2, question: 'Does Task Manager show any background process consuming over 50% CPU?', userResponse: 'NO' },
        { step: 3, question: 'Do you see visible dust clogging the bottom intake vents?', userResponse: 'NO' }
      ]),
      created_at: new Date(now.getTime() - 3600000 * 3).toISOString()
    })
    .onConflictDoNothing();
}
