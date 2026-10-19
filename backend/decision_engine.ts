import { getKBEntryById, KBProblemEntry, DecisionOption } from './knowledge_base.ts';
import { db } from '../db/index.js';
import { issues, conversations, messages, troubleshooting_steps } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

export interface StartDiagnosisSessionResult {
  isValid: boolean;
  error?: string;
  issueId: string;
  conversationId: string;
  problemId: string;
  category: string;
  title: string;
  severity: string;
  symptoms: string[];
  possibleCauses: string[];
  currentNodeId: string;
  stepNumber: number;
  instruction: string;
  question: string;
  options: string[];
  optionsDetails: DecisionOption[];
  status: string;
}

export interface StepEvaluationResult {
  isValid: boolean;
  error?: string;
  status: 'IN PROGRESS' | 'RESOLVED' | 'ESCALATED';
  isComplete: boolean;
  isEscalated: boolean;
  currentNodeId?: string;
  stepNumber?: number;
  instruction?: string;
  question?: string;
  options?: string[];
  optionsDetails?: DecisionOption[];
  resolutionText?: string;
  escalationReason?: string;
  summary?: string;
}

function invalidSession(problemId: string, category: string, error: string): StartDiagnosisSessionResult {
  return {
    isValid: false,
    error,
    issueId: '',
    conversationId: '',
    problemId,
    category,
    title: '',
    severity: 'MEDIUM',
    symptoms: [],
    possibleCauses: [],
    currentNodeId: '',
    stepNumber: 0,
    instruction: '',
    question: '',
    options: [],
    optionsDetails: [],
    status: 'OPEN'
  };
}

export async function startDiagnosisSession(
  userId: string,
  problemText: string,
  problemId: string,
  category: string,
  confidence: number
): Promise<StartDiagnosisSessionResult> {
  const entry = await getKBEntryById(problemId);
  if (!entry) {
    return invalidSession(problemId, category, `Knowledge base template for '${problemId}' not found.`);
  }

  const startNode = entry.nodes?.start;
  if (!startNode) {
    return invalidSession(problemId, category, 'Malformed troubleshooting tree: missing start node.');
  }

  const issueId = `issue_${crypto.randomUUID().slice(0, 8)}`;
  const conversationId = `conv_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  // 1. Create Issue record
  await db.insert(issues).values({
    id: issueId,
    user_id: userId,
    problem_text: problemText,
    category,
    matched_problem_id: problemId,
    confidence,
    severity: entry.severity,
    status: 'IN PROGRESS',
    created_at: now,
    updated_at: now
  });

  // 2. Create Conversation record
  await db.insert(conversations).values({
    id: conversationId,
    user_id: userId,
    issue_id: issueId,
    title: `${entry.title} Diagnosis`,
    status: 'ACTIVE',
    created_at: now,
    updated_at: now
  });

  // 3. Add initial user message
  await db.insert(messages).values({
    id: `msg_${crypto.randomUUID().slice(0, 8)}`,
    conversation_id: conversationId,
    sender: 'user',
    content: problemText,
    metadata_json: JSON.stringify({ category, confidence }),
    created_at: now
  });

  // 4. Add initial agent response with first diagnostic question
  const agentInitialContent =
    `I have classified your problem as **${category}**: *${entry.title}*.\n\n` +
    `**Possible Causes:**\n` +
    entry.possibleCauses.map((c) => `• ${c}`).join('\n') +
    `\n\nLet's troubleshoot step-by-step.\n\n` +
    `**Step 1:** ${startNode.instruction}\n\n` +
    `**Question:** ${startNode.question}`;

  await db.insert(messages).values({
    id: `msg_${crypto.randomUUID().slice(0, 8)}`,
    conversation_id: conversationId,
    sender: 'agent',
    content: agentInitialContent,
    metadata_json: JSON.stringify({
      nodeId: 'start',
      stepNumber: 1,
      options: startNode.options.map((o) => o.label)
    }),
    created_at: now
  });

  return {
    isValid: true,
    issueId,
    conversationId,
    problemId,
    category: entry.category,
    title: entry.title,
    severity: entry.severity,
    symptoms: entry.symptoms,
    possibleCauses: entry.possibleCauses,
    currentNodeId: 'start',
    stepNumber: startNode.stepNumber || 1,
    instruction: startNode.instruction,
    question: startNode.question,
    options: startNode.options.map((o) => o.label),
    optionsDetails: startNode.options,
    status: 'IN PROGRESS'
  };
}

export async function evaluateStepResponse(
  issueId: string,
  conversationId: string,
  problemId: string,
  currentNodeId: string,
  userResponse: string
): Promise<StepEvaluationResult> {
  const entry = await getKBEntryById(problemId);
  if (!entry) {
    return { isValid: false, error: 'Knowledge base entry not found.', status: 'IN PROGRESS', isComplete: false, isEscalated: false };
  }

  const nodes = entry.nodes || {};
  const currentNode = nodes[currentNodeId];
  if (!currentNode) {
    return { isValid: false, error: `Invalid step node: ${currentNodeId}`, status: 'IN PROGRESS', isComplete: false, isEscalated: false };
  }

  const respNorm = userResponse.trim().toUpperCase();

  // Find matching option
  let matchedOpt: DecisionOption | undefined = currentNode.options.find(
    (opt) => opt.label.toUpperCase() === respNorm || respNorm.includes(opt.label.toUpperCase())
  );

  if (!matchedOpt) {
    if (respNorm.includes('YES')) {
      matchedOpt = currentNode.options.find((o) => o.label.toUpperCase().includes('YES'));
    } else if (respNorm.includes('NO')) {
      matchedOpt = currentNode.options.find((o) => o.label.toUpperCase().includes('NO'));
    }
  }

  if (!matchedOpt) {
    return {
      isValid: false,
      error: `Please choose one of the available choices: ${currentNode.options.map((o) => o.label).join(', ')}`,
      status: 'IN PROGRESS',
      isComplete: false,
      isEscalated: false
    };
  }

  const now = new Date().toISOString();

  // 1. Record the user message in conversation
  await db.insert(messages).values({
    id: `msg_${crypto.randomUUID().slice(0, 8)}`,
    conversation_id: conversationId,
    sender: 'user',
    content: userResponse,
    metadata_json: JSON.stringify({ chosenOption: matchedOpt.label }),
    created_at: now
  });

  // 2. Record the troubleshooting step in database
  await db.insert(troubleshooting_steps).values({
    id: `step_${crypto.randomUUID().slice(0, 8)}`,
    issue_id: issueId,
    step_number: currentNode.stepNumber || 1,
    node_id: currentNodeId,
    question: currentNode.question,
    instruction: currentNode.instruction,
    user_response: userResponse,
    outcome: matchedOpt.summary || (matchedOpt.isResolution ? 'Resolved' : matchedOpt.isEscalation ? 'Escalated' : 'Advanced to next step'),
    created_at: now
  });

  // 3. Handle Resolution
  if (matchedOpt.isResolution) {
    const resolutionText = matchedOpt.resolutionText || 'Issue resolved successfully.';

    await db
      .update(issues)
      .set({ status: 'RESOLVED', resolution_summary: resolutionText, updated_at: now })
      .where(eq(issues.id, issueId));

    await db.update(conversations).set({ status: 'RESOLVED', updated_at: now }).where(eq(conversations.id, conversationId));

    const agentMsg =
      `🎉 **Issue Resolved!**\n\n${resolutionText}\n\nThank you for using TechAssist AI. Your troubleshooting session has been archived in My Issues.`;
    await db.insert(messages).values({
      id: `msg_${crypto.randomUUID().slice(0, 8)}`,
      conversation_id: conversationId,
      sender: 'agent',
      content: agentMsg,
      metadata_json: JSON.stringify({ isResolution: true }),
      created_at: now
    });

    return {
      isValid: true,
      status: 'RESOLVED',
      isComplete: true,
      isEscalated: false,
      resolutionText,
      summary: matchedOpt.summary
    };
  }

  // 4. Handle Escalation
  if (matchedOpt.isEscalation) {
    const escalationReason = matchedOpt.escalationReason || 'Automated troubleshooting steps did not resolve the problem.';

    await db
      .update(issues)
      .set({ status: 'ESCALATED', resolution_summary: `Escalated: ${escalationReason}`, updated_at: now })
      .where(eq(issues.id, issueId));

    await db.update(conversations).set({ status: 'ESCALATED', updated_at: now }).where(eq(conversations.id, conversationId));

    return {
      isValid: true,
      status: 'ESCALATED',
      isComplete: true,
      isEscalated: true,
      escalationReason,
      summary: matchedOpt.summary
    };
  }

  // 5. Advance to next node
  const nextNodeId = matchedOpt.nextNodeId;
  if (!nextNodeId || !nodes[nextNodeId]) {
    // Reached leaf node without resolution -> Escalate
    const reason = 'End of automated troubleshooting tree reached without complete resolution.';
    await db
      .update(issues)
      .set({ status: 'ESCALATED', resolution_summary: `Escalated: ${reason}`, updated_at: now })
      .where(eq(issues.id, issueId));

    return {
      isValid: true,
      status: 'ESCALATED',
      isComplete: true,
      isEscalated: true,
      escalationReason: reason
    };
  }

  const nextNode = nodes[nextNodeId];
  const agentMsg = `**Step ${nextNode.stepNumber}:** ${nextNode.instruction}\n\n**Question:** ${nextNode.question}`;

  await db.insert(messages).values({
    id: `msg_${crypto.randomUUID().slice(0, 8)}`,
    conversation_id: conversationId,
    sender: 'agent',
    content: agentMsg,
    metadata_json: JSON.stringify({
      nodeId: nextNodeId,
      stepNumber: nextNode.stepNumber,
      options: nextNode.options.map((o) => o.label)
    }),
    created_at: now
  });

  return {
    isValid: true,
    status: 'IN PROGRESS',
    isComplete: false,
    isEscalated: false,
    currentNodeId: nextNodeId,
    stepNumber: nextNode.stepNumber,
    instruction: nextNode.instruction,
    question: nextNode.question,
    options: nextNode.options.map((o) => o.label),
    optionsDetails: nextNode.options,
    summary: matchedOpt.summary
  };
}
