import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as argon2 from "argon2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session");

  return NextResponse.json({ message: sessionToken });
}
