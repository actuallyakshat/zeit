import { pgTable, serial, text, bigint, unique, uuid, timestamp, integer, boolean, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const drizzleMigrations = pgTable("__drizzle_migrations", {
	id: serial().primaryKey().notNull(),
	hash: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
});

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	username: text().notNull(),
	clerkId: text("clerk_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	monthlyIncome: integer("monthly_income"),
	numberOfWorkingDays: integer("number_of_working_days"),
	useWorkingDaysForCalculation: boolean("use_working_days_for_calculation").default(true),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_username_unique").on(table.username),
	unique("user_clerk_id_unique").on(table.clerkId),
]);

export const wishlistItem = pgTable("wishlist_item", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	url: text(),
	imageUrl: text("image_url"),
	price: integer(),
	purchased: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "wishlist_item_user_id_user_id_fk"
		}).onDelete("cascade"),
]);
