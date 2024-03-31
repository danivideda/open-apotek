"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { artificialDelay } from "../lib/utils";

export async function register(prevState: any, formData: FormData) {
  await artificialDelay(500);

  const schema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
  });

  const formDataResponse = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const zodParsed = schema.safeParse(formDataResponse);
  if (!zodParsed.success) {
    return "Please check again";
  }

  const { username, password } = zodParsed.data;
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

  NextResponse.json({ message: "success lurrrr" });
  redirect("/login?register=success");
}
