"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import * as jose from "jose";
import { sessionTokenCookieConfig } from "../../lib";
import { redirect } from "next/navigation";

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

    const sessionTTL = 12 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + sessionTTL);
    const sessionToken = await new jose.SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expires)
      .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!));

    await db
      .update(users)
      .set({ jwtRefreshToken: sessionToken })
      .where(eq(users.username, username));

    cookies().set(sessionTokenCookieConfig({ value: sessionToken, expires }));
  } catch (e) {
    console.log(e);
    return "Internal server error";
  }
  redirect("/dashboard");
}
