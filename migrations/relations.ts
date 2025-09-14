import { relations } from "drizzle-orm/relations";
import { user, wishlistItem } from "./schema";

export const wishlistItemRelations = relations(wishlistItem, ({one}) => ({
	user: one(user, {
		fields: [wishlistItem.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	wishlistItems: many(wishlistItem),
}));