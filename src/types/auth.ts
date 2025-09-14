import { user } from "@/db/schema";
import { UserResource } from "@clerk/types";
import { InferSelectModel } from "drizzle-orm";

export type DBUser = InferSelectModel<typeof user>;

export interface AuthContextInterface {
  user: DBUser | null;
  clerkUser: UserResource | null | undefined;
  isAuthenticated: boolean;
  signOut: () => void;
  refetchUser: () => Promise<void>;
  isLoading: boolean;
}
