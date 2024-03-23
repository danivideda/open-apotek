import { db } from "@/db";
import { users } from "@/db/schema/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const allUser = db.select().from(users).all();
  return NextResponse.json({
    msg: "hello there!",
  });
}
