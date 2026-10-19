export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface DecisionOption {
  label: string;
  nextNodeId?: string;
  isResolution?: boolean;
  resolutionText?: string;
  isEscalation?: boolean;
  escalationReason?: string;
  summary?: string;
}

export interface DecisionNode {
  stepNumber: number;
  instruction: string;
  question: string;
  options: DecisionOption[];
}

export interface KBProblemEntry {
  problemId: string;
  category: string;
  title: string;
  severity: string;
  symptoms: string[];
  possibleCauses: string[];
  initialQuestion?: string;
  initialOptions?: string[];
  nodes: Record<string, DecisionNode>;
}

export interface Issue {
  id: string;
  user_id: string;
  problem_text: string;
  category: string;
  matched_problem_id: string | null;
  confidence: number;
  severity: string;
  status: 'OPEN' | 'IN PROGRESS' | 'RESOLVED' | 'ESCALATED';
  resolution_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface TroubleshootingStep {
  id: string;
  issue_id: string;
  step_number: number;
  node_id: string;
  question: string;
  instruction?: string;
  user_response?: string;
  outcome?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  issue_id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  problem_text?: string;
  category?: string;
  matched_problem_id?: string;
  severity?: string;
  issue_status?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  metadata_json?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  issue_id: string;
  problem_description: string;
  category: string;
  severity: string;
  priority: string;
  status: string;
  escalation_reason: string;
  steps_attempted: Array<{
    step: number;
    question: string;
    instruction?: string;
    userResponse: string;
    outcome?: string;
  }>;
  created_at: string;
}

export interface DashboardStats {
  activeIssues: number;
  resolvedIssues: number;
  escalatedIssues: number;
  openTickets: number;
  recentConversations: Conversation[];
  categoryDistribution: Array<{ category: string; count: number }>;
}

export interface DiagnosticSessionState {
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
  optionsDetails?: DecisionOption[];
  status: 'IN PROGRESS' | 'RESOLVED' | 'ESCALATED';
  isComplete: boolean;
  resolutionText?: string;
  escalationReason?: string;
  ticket?: SupportTicket | null;
  history: Array<{
    stepNumber: number;
    instruction: string;
    question: string;
    userResponse: string;
    summary?: string;
  }>;
}
