import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const rootEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map(e => e.trim());

  const isAdmin = rootEmails.includes(req.auth?.user?.email ?? "");
  const isTargetingAdmin = req.nextUrl.pathname.startsWith("/admin");

  if (isTargetingAdmin && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};