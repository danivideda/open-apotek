import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE Path:", request.nextUrl.pathname);
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
