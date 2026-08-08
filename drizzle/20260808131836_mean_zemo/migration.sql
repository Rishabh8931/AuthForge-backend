CREATE TYPE "client_grant_type" AS ENUM('authorization_code', 'refresh_token');--> statement-breakpoint
CREATE TYPE "client_type" AS ENUM('public', 'confidential');--> statement-breakpoint
CREATE TYPE "token_type" AS ENUM('access', 'refresh');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_type" text NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"resource_type" text,
	"resource_id" uuid,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authorizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"code_hash" text NOT NULL,
	"redirect_uri" text NOT NULL,
	"scope" text NOT NULL,
	"code_challenge" text NOT NULL,
	"code_challenge_method" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_grant_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" uuid NOT NULL,
	"grant_type" "client_grant_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_redirect_uris" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" uuid NOT NULL,
	"redirect_uri" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_scopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"developer_id" uuid NOT NULL,
	"client_id" text NOT NULL,
	"client_name" text NOT NULL,
	"client_type" "client_type" NOT NULL,
	"client_secret_hash" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"granted_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uq_consents_user_client" UNIQUE("user_id","client_id")
);
--> statement-breakpoint
CREATE TABLE "developers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"session_token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"token_type" "token_type" NOT NULL,
	"scope" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"rotated_from_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs" ("actor_type","actor_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs" ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" ("created_at");--> statement-breakpoint
CREATE INDEX "idx_authorizations_client_id" ON "authorizations" ("client_id");--> statement-breakpoint
CREATE INDEX "idx_authorizations_user_id" ON "authorizations" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_authorizations_session_id" ON "authorizations" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_authorizations_expires_at" ON "authorizations" ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_authorizations_code_hash" ON "authorizations" ("code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_client_grant_types_client_grant" ON "client_grant_types" ("client_id","grant_type");--> statement-breakpoint
CREATE INDEX "idx_client_grant_types_client_id" ON "client_grant_types" ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_client_redirect_uris_client_uri" ON "client_redirect_uris" ("client_id","redirect_uri");--> statement-breakpoint
CREATE INDEX "idx_client_redirect_uris_client_id" ON "client_redirect_uris" ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_client_scopes_client_scope" ON "client_scopes" ("client_id","scope");--> statement-breakpoint
CREATE INDEX "idx_client_scopes_client_id" ON "client_scopes" ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_clients_client_id" ON "clients" ("client_id");--> statement-breakpoint
CREATE INDEX "idx_clients_developer_id" ON "clients" ("developer_id");--> statement-breakpoint
CREATE INDEX "idx_consents_user_id" ON "consents" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_consents_client_id" ON "consents" ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_developers_email" ON "developers" ("email");--> statement-breakpoint
CREATE INDEX "idx_developers_is_active" ON "developers" ("is_active");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_expires_at" ON "sessions" ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_tokens_client_id" ON "tokens" ("client_id");--> statement-breakpoint
CREATE INDEX "idx_tokens_user_id" ON "tokens" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tokens_session_id" ON "tokens" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_tokens_token_hash" ON "tokens" ("token_hash");--> statement-breakpoint
CREATE INDEX "idx_tokens_expires_at" ON "tokens" ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_tokens_rotated_from_id" ON "tokens" ("rotated_from_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_email" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "idx_users_is_active" ON "users" ("is_active");--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "client_grant_types" ADD CONSTRAINT "client_grant_types_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "client_redirect_uris" ADD CONSTRAINT "client_redirect_uris_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "client_scopes" ADD CONSTRAINT "client_scopes_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_developer_id_developers_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;