import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  const userSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
  });

  const userParse = userSchema.safeParse(await request.json());
  if (!userParse.success) {
    const { errors } = userParse.error;
    return Response.json(
      {
        message: { message: "Invalid request", errors },
      },
      {
        status: 400,
      }
    );
  }

  const user = userParse.data;
  const usersQuery = await db
    .select()
    .from(users)
    .where(eq(users.username, user.username));
  if (usersQuery.length < 1)
    return Response.json({ message: "User doesn't exist" }, { status: 400 });

  const isPaswordValid = await argon2.verify(
    usersQuery[0].passwordHash,
    user.password
  );
  if (!isPaswordValid)
    return Response.json({ message: "Wrong password" }, { status: 400 });

  const accessToken =  generateAccessToken(user.username)
  const refreshToken =  generateRefreshToken(user.username)

  await db
    .update(users)
    .set({ jwtRefreshToken: refreshToken })
    .where(eq(users.username, usersQuery[0].username));

  const response = NextResponse.json({
    data: {
      access_token: accessToken,
    },
  });
  response.cookies.set("session", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh",
  });

  return response;
}
