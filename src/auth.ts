import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
// 1. IMPORT YOUR CONFIGURED PRISMA INSTANCE
import { prisma } from "@/lib/prisma" 

/**
 * APS INDUSTRIES AUTH CONFIGURATION
 * Strategy: Database (PostgreSQL via Prisma)
 * Powered by Prisma 7 & Neon
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // 2. USE THE IMPORTED INSTANCE (This has the Adapter Prisma 7 needs)
  adapter: PrismaAdapter(prisma),
  
  // Industrial-style custom login configuration
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    /**
     * SECURITY TERMINAL: The session callback determines what data 
     * is accessible to the frontend Header and Dashboard components.
     */
    async session({ session, user }) {
      if (session.user) {
        // 1. Inject Database ID
        session.user.id = user.id;
        
        // 2. ADMIN CLEARANCE LOGIC
        // Reads admin emails from .env — supports multiple emails comma separated
        const rootEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
          .split(",")
          .map(e => e.trim());
        const isRoot = rootEmails.includes(user.email ?? "");
        
        // Note: You may need to extend the Session type in a next-auth.d.ts file 
        // if TypeScript complains about .role
        (session.user as any).role = isRoot ? "ROOT" : "OPERATOR";
      }
      return session;
    },

    /**
     * ACCESS LOGS: Monitors sign-in attempts in the server console.
     */
    async signIn({ user }) {
      const timestamp = new Date().toISOString();
      console.log(`[AUTH_GATE] ${timestamp}: Access attempted by ${user.email}`);
      return true;
    },
  },

  events: {
    /**
     * TRIGGER: Runs when a brand new user is saved to the PostgreSQL database.
     */
    async createUser({ user }) {
      console.log(`[DATABASE_SYNC]: New Operator Profile Provisioned - ID: ${user.id}`);
    },
  },

  session: {
    strategy: "database", // Sessions are tracked in the DB for higher security
    maxAge: 30 * 24 * 60 * 60, // 30-day session lifespan
  },
})