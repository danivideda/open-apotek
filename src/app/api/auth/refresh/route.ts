import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) {
    return NextResponse.json({ message: "No user session" }, { status: 400 });
  }

  try {
    const sessionToken = sessionCookie.value;
    const decoded = jwt.verify(sessionToken, process.env.JWT_REFRESH_SECRET!);
    const username = (decoded as JwtPayload).username;

    const refreshTokenFromDB = (
      await db.select().from(users).where(eq(users.username, username))
    )[0].jwtRefreshToken;
    if (sessionToken !== refreshTokenFromDB) {
      const response = NextResponse.json(null);
      response.cookies.delete("session");

      return response;
    }

    if (sessionToken !== refreshTokenFromDB) {
      const response = NextResponse.json({
        data: {
          access_token: jwt.sign({ username }, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: "5m",
          }),
        },
      });

      return response;
    } else {
      const response = NextResponse.json(null);
      response.cookies.delete("session");

      return response;
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log(error.message, "at", error.expiredAt);
    } else {
      console.log((error as Error).message);
    }

    const response = NextResponse.json(
      { message: "Session is not valid" },
      { status: 400 }
    );
    response.cookies.delete({
      name: "session",
      httpOnly: true,
      path: "/api/auth/refresh",
    });

    return response;
  }
}
