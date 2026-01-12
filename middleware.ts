import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { adminAuthorize } from "@/lib/roles";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const authUser = await adminAuthorize(req.cookies.get(AUTH_TOKEN_KEY)?.value);
    if (!authUser) return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
