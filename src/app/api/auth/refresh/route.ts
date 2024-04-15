import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { NextRequest } from "next/server";
import {
  ResponseStatus,
  createResponse,
  generateAccessToken,
} from "@/app/helpers";
import { refreshTokenCookieConfig } from "@/app/helpers/auth";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) {
    return createResponse(ResponseStatus.BadRequest, "No user session");
  }

  try {
    const sessionToken = sessionCookie.value;
    const decoded = jwt.verify(sessionToken, process.env.JWT_REFRESH_SECRET!);
    const username = (decoded as JwtPayload).username;

    const refreshTokenFromDB = (
      await db.select().from(users).where(eq(users.username, username))
    )[0].jwtRefreshToken;
    if (sessionToken !== refreshTokenFromDB) {
      const response = createResponse(
        ResponseStatus.BadRequest,
        "Invalid Request"
      );
      response.cookies.delete(refreshTokenCookieConfig());
    }

    const accessToken = generateAccessToken(username);

    return createResponse(ResponseStatus.Ok, "Generated new access token", {
      access_token: accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log(error.message, "at", error.expiredAt);
    } else {
      console.log((error as Error).message);
    }

    const response = createResponse(
      ResponseStatus.BadRequest,
      "Session is not valid"
    );
    response.cookies.delete(refreshTokenCookieConfig());

    return response;
  }
}
