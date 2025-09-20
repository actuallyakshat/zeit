ALTER TABLE "user" ADD COLUMN "is_synchronised_with_vector_store" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_synced_at" timestamp;