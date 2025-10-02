CREATE TABLE "cook_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_cooked" boolean DEFAULT false NOT NULL,
	"is_email_sent" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_synchronised_with_vector_store" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "cook_item" ADD CONSTRAINT "cook_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cook_item" ADD CONSTRAINT "cook_item_item_id_wishlist_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."wishlist_item"("id") ON DELETE cascade ON UPDATE no action;