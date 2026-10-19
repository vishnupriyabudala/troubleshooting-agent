import { pgTable, text, integer, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password_hash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'),
  created_at: text('created_at').notNull(),
});

export const sessions = pgTable('sessions', {
  token: text('token').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires_at: text('expires_at').notNull(),
});

export const issues = pgTable('issues', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  problem_text: text('problem_text').notNull(),
  category: text('category').notNull(),
  matched_problem_id: text('matched_problem_id'),
  confidence: real('confidence').notNull().default(1.0),
  severity: text('severity').notNull().default('MEDIUM'),
  status: text('status').notNull().default('IN PROGRESS'),
  resolution_summary: text('resolution_summary'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  issue_id: text('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversation_id: text('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(),
  content: text('content').notNull(),
  metadata_json: text('metadata_json'),
  created_at: text('created_at').notNull(),
});

export const troubleshooting_steps = pgTable('troubleshooting_steps', {
  id: text('id').primaryKey(),
  issue_id: text('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  step_number: integer('step_number').notNull(),
  node_id: text('node_id').notNull(),
  question: text('question').notNull(),
  instruction: text('instruction'),
  user_response: text('user_response'),
  outcome: text('outcome'),
  created_at: text('created_at').notNull(),
});

export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  issue_id: text('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  problem_description: text('problem_description').notNull(),
  category: text('category').notNull(),
  severity: text('severity').notNull(),
  priority: text('priority').notNull(),
  status: text('status').notNull().default('OPEN'),
  escalation_reason: text('escalation_reason').notNull(),
  steps_attempted_json: text('steps_attempted_json').notNull().default('[]'),
  created_at: text('created_at').notNull(),
});

export const knowledge_base = pgTable('knowledge_base', {
  id: text('id').primaryKey(),
  problem_id: text('problem_id').notNull().unique(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  severity: text('severity').notNull().default('MEDIUM'),
  symptoms_json: text('symptoms_json').notNull().default('[]'),
  possible_causes_json: text('possible_causes_json').notNull().default('[]'),
  troubleshooting_tree_json: text('troubleshooting_tree_json').notNull().default('{}'),
  created_at: text('created_at').notNull(),
});

export const feedback = pgTable('feedback', {
  id: text('id').primaryKey(),
  issue_id: text('issue_id')
    .notNull()
    .references(() => issues.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comments: text('comments'),
  created_at: text('created_at').notNull(),
});
