import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, etc.
   */
  interface Session {
    user: {
      id: string;
      role: "ROOT" | "OPERATOR";
    } & DefaultSession["user"]
  }

  /**
   * The user object found in the database and passed to callbacks
   */
  interface User {
    role?: string | null;
  }
}

// If you ever switch to JWT strategy, add this as well:
declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
  }
}