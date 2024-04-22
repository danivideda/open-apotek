import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { ResponseStatus, createResponse } from "@/lib";
import { sessionTokenCookieConfig } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(
    sessionTokenCookieConfig().name
  )?.value;

  if (!sessionToken) {
    return createResponse(ResponseStatus.BadRequest, "No user session");
  }

  try {
    const { payload } = await jose.jwtVerify(
      sessionToken,
      new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)
    );
    const username = payload.username as string;
    const usersQuery = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (usersQuery.length === 0) {
      return createResponse(ResponseStatus.BadRequest, "User not found");
    }

    const sessionTokenFromDB = usersQuery[0].sessionToken;
    if (sessionToken !== sessionTokenFromDB) {
      return createResponse(ResponseStatus.BadRequest, "Session doesn't match");
    }

    return createResponse(ResponseStatus.Ok, "Ok");
  } catch (error) {
    console.log(error);

    return createResponse(
      ResponseStatus.InternalError,
      "Internal error from server"
    );
  }
}
