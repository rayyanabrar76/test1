import { auth } from "@/auth";
import { NextResponse } from "next/server";

// In Next.js 16, the default export is recognized as the 'proxy' handler
export default auth((req) => {
  const isAdmin = req.auth?.user?.email === "rayyanabrar456@gmail.com";
  const isTargetingAdmin = req.nextUrl.pathname.startsWith("/admin");

  // Security Logic
  if (isTargetingAdmin && !isAdmin) {
    // Redirect unauthorized attempts to the homepage
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  
  return NextResponse.next();
});

export const config = {
  // Matches all admin pages and protected API routes
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};