"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { sessionTokenCookieConfig } from "../lib";

export async function login(prevState: any, formData: FormData) {
  const schema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
  });

  const validatedForm = schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedForm.success) {
    console.log(validatedForm.error.message);
    return "Please check again";
  }

  try {
    const { username, password } = validatedForm.data;
    const response = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (response.length === 0) {
      return "User not found.";
    }

    const isPasswordValid = await argon2.verify(
      response[0].passwordHash,
      password
    );
    if (!isPasswordValid) {
      return "Wrong password.";
    }

    const session_expiry = 12 * 60 * 60;
    const expires = new Date(Date.now() + session_expiry);
    const session_token = jwt.sign(
      { username },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: session_expiry }
    );

    await db
      .update(users)
      .set({ jwtRefreshToken: session_token })
      .where(eq(users.username, username));

    cookies().set(sessionTokenCookieConfig({ value: session_token, expires }));
    // return "redirect";
  } catch (e) {
    console.log(e);
    return "Internal server error";
  }

  // redirect("/dashboard");
}
