import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import * as argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import { ResponseStatus, artificialDelay, createResponse } from "@/app/lib";

export async function POST(request: NextRequest) {
  await artificialDelay(500);

  const reqBodySchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const reqBodyParsed = reqBodySchema.safeParse(await request.json());
  if (!reqBodyParsed.success) {
    return createResponse(ResponseStatus.BadRequest, "Invalid Request");
  }

  try {
    const newUser = reqBodyParsed.data;
    const userExist = await db
      .select()
      .from(users)
      .where(eq(users.username, newUser.username));
    if (userExist.length) {
      return createResponse(ResponseStatus.BadRequest, "User already exist.");
    }

    await db.insert(users).values({
      username: newUser.username,
      passwordHash: await argon2.hash(newUser.password),
    });

    return createResponse(ResponseStatus.Created, "Successfully registered");
  } catch (error) {
    console.log(error);

    return createResponse(
      ResponseStatus.InternalError,
      "Internal server error."
    );
  }
}
