"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { artificialDelay } from "../lib";

export async function register(prevState: any, formData: FormData) {
  await artificialDelay(500);

  const schema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
  });

  const validatedFields = schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return "Please check again";
  }

  const { username, password } = validatedFields.data;
  const userExist = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (userExist.length) {
    return "User already exist.";
  }

  try {
    const passwordHash = await argon2.hash(password);
    await db.insert(users).values({ username, passwordHash });
  } catch (error) {
    console.log(error);
  }

  redirect("/login?register=success");
}
