CREATE TABLE "conversations" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"issue_id" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" text PRIMARY KEY,
	"issue_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comments" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"problem_text" text NOT NULL,
	"category" text NOT NULL,
	"matched_problem_id" text,
	"confidence" real DEFAULT 1 NOT NULL,
	"severity" text DEFAULT 'MEDIUM' NOT NULL,
	"status" text DEFAULT 'IN PROGRESS' NOT NULL,
	"resolution_summary" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" text PRIMARY KEY,
	"problem_id" text NOT NULL UNIQUE,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"severity" text DEFAULT 'MEDIUM' NOT NULL,
	"symptoms_json" text DEFAULT '[]' NOT NULL,
	"possible_causes_json" text DEFAULT '[]' NOT NULL,
	"troubleshooting_tree_json" text DEFAULT '{}' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY,
	"conversation_id" text NOT NULL,
	"sender" text NOT NULL,
	"content" text NOT NULL,
	"metadata_json" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"expires_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"issue_id" text NOT NULL,
	"problem_description" text NOT NULL,
	"category" text NOT NULL,
	"severity" text NOT NULL,
	"priority" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"escalation_reason" text NOT NULL,
	"steps_attempted_json" text DEFAULT '[]' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "troubleshooting_steps" (
	"id" text PRIMARY KEY,
	"issue_id" text NOT NULL,
	"step_number" integer NOT NULL,
	"node_id" text NOT NULL,
	"question" text NOT NULL,
	"instruction" text,
	"user_response" text,
	"outcome" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "troubleshooting_steps" ADD CONSTRAINT "troubleshooting_steps_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;