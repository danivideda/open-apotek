import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const reqBodySchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const reqBodyParsed = reqBodySchema.safeParse(await request.json());
  if (!reqBodyParsed.success) {
    const { errors } = reqBodyParsed.error;
    return NextResponse.json(
      {
        message: { message: "Invalid request", errors },
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({ message: "Hello world! owo" });
}
