import { cookItem, user, wishlistItem } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type DbUser = InferSelectModel<typeof user>;
type CookItem = InferSelectModel<typeof cookItem>;
type WishlistItem = InferSelectModel<typeof wishlistItem>;

export type { DbUser, CookItem, WishlistItem };
