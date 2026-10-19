import { db } from '../db/index.js';
import { knowledge_base } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import kbSeedData from '../data/knowledge_base.json';

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

interface KBRow {
  id: string;
  problem_id: string;
  category: string;
  title: string;
  severity: string;
  symptoms_json: string;
  possible_causes_json: string;
  troubleshooting_tree_json: string;
  created_at: string;
}

function rowToEntry(row: KBRow): KBProblemEntry {
  return {
    problemId: row.problem_id,
    category: row.category,
    title: row.title,
    severity: row.severity,
    symptoms: JSON.parse(row.symptoms_json || '[]'),
    possibleCauses: JSON.parse(row.possible_causes_json || '[]'),
    nodes: JSON.parse(row.troubleshooting_tree_json || '{}')
  };
}

export async function getAllKBEntries(): Promise<KBProblemEntry[]> {
  try {
    const rows = await db.select().from(knowledge_base).orderBy(asc(knowledge_base.category));
    if (rows && rows.length > 0) {
      return rows.map(rowToEntry);
    }
  } catch (err) {
    console.error('[KB] Error querying database, falling back to JSON:', err);
  }

  return kbSeedData as unknown as KBProblemEntry[];
}

export async function getKBEntryById(problemId: string): Promise<KBProblemEntry | null> {
  try {
    const rows = await db.select().from(knowledge_base).where(eq(knowledge_base.problem_id, problemId));
    if (rows && rows.length > 0) {
      return rowToEntry(rows[0]);
    }
  } catch (err) {
    console.error('[KB] Error fetching problem entry from DB:', err);
  }

  const entries = (kbSeedData as unknown as KBProblemEntry[]).filter((e) => e.problemId === problemId);
  return entries[0] || null;
}
