import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import * as argon2 from "argon2";
import { NextRequest } from "next/server";
import {
  ResponseStatus,
  createResponse,
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib";
import { sessionTokenCookieConfig } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  const reqBodySchema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
  });

  const reqBodyParsed = reqBodySchema.safeParse(await request.json());
  if (!reqBodyParsed.success) {
    return createResponse(ResponseStatus.BadRequest, "Zod error");
  }

  const user = reqBodyParsed.data;
  const usersQuery = await db
    .select()
    .from(users)
    .where(eq(users.username, user.username));
  if (usersQuery.length < 1) {
    return createResponse(ResponseStatus.BadRequest, "User doesn't exist");
  }

  const isPaswordValid = await argon2.verify(
    usersQuery[0].passwordHash,
    user.password
  );
  if (!isPaswordValid) {
    return createResponse(ResponseStatus.BadRequest, "Wrong password");
  }

  const accessToken = generateAccessToken(user.username);
  const refreshToken = generateRefreshToken(user.username);

  await db
    .update(users)
    .set({ jwtRefreshToken: refreshToken })
    .where(eq(users.username, usersQuery[0].username));

  const response = createResponse(ResponseStatus.Ok, "Successfully logged in", {
    access_token: accessToken,
  });
  response.cookies.set(sessionTokenCookieConfig(refreshToken));

  return response;
}
