import { db } from "@/db";
import { users } from "@/db/schema/users";

export async function handleAuth(username: string, password: string) {
  // await db.insert(users).values({
  //   username: username,
  //   passwordHash: password,
  // });
  return "success";
}
