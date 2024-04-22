import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { ResponseStatus, sessionTokenCookieConfig } from "./app/lib";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE Path:", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith("/login")) {
    const sessionToken = request.cookies.get(
      sessionTokenCookieConfig().name
    )?.value;
    if (!sessionToken) {
      return NextResponse.next();
    }

    try {
      await jose.jwtVerify(
        sessionToken,
        new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)
      );

      const urlFetch = `http://${request.nextUrl.host}/api/auth/check`;
      const response = await fetch(urlFetch, {
        method: "GET",
        headers: {
          Cookie: `${sessionTokenCookieConfig().name}=${sessionToken}`,
        },
      });

      if (response.status === ResponseStatus.BadRequest) {
        const body = await response.json();
        throw new Error(body.message);
      }

      const urlRedirect = request.nextUrl.clone();
      urlRedirect.pathname = "/dashboard";

      return NextResponse.redirect(urlRedirect);
    } catch (error) {
      console.log(error);

      return NextResponse.next();
    }
  }

  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   const sessionToken = request.cookies.get(
  //     sessionTokenCookieConfig().name
  //   )?.value;
  //   if (!sessionToken) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";

  //     return NextResponse.redirect(url);
  //   }

  //   try {
  //     await jose.jwtVerify(
  //       sessionToken,
  //       new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)
  //     );

  //     const urlApi = `http://${request.nextUrl.host}/api/auth/check`;
  //     const response = await fetch(urlApi, { method: "GET" });
  //     if (response.status === ResponseStatus.BadRequest) {
  //       throw new Error("Check sessionToken in DB doesn't match");
  //     }

  //     return NextResponse.next();
  //   } catch (error) {
  //     console.log(error);

  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";

  //     return NextResponse.redirect(url);
  //   }
  // }
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
