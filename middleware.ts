import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { adminAuthorize, authorize } from "@/lib/roles";

export default async function middleware(req: NextRequest) {
  const curPath = req.nextUrl.pathname;
  const authToken = req.cookies.get(AUTH_TOKEN_KEY)?.value
  if (curPath.startsWith('/admin')) {
    const authUser = await adminAuthorize(authToken);
    if (!authUser) return NextResponse.redirect(new URL('/', req.url));
  }

  if (curPath.startsWith('/profile')) {
    const authUser = await authorize(authToken);
    if (!authUser) return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}
