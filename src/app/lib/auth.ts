import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";

export async function handleAuth(
  username: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  payload?: {
    jwt_access: string;
    jwt_refresh: string;
  };
}> {
  // await db.insert(users).values({
  //   username: username,
  //   passwordHash: password,
  // });

  try {
    const response = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (response.length === 0) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const passwordIsValid = await argon2.verify(
      response[0].passwordHash,
      password
    );
    if (!passwordIsValid) {
      return {
        success: false,
        message: "Wrong password dumbass.",
      };
    }

    return {
      success: true,
      message: "Successfully logged in.",
      payload: {
        jwt_access: "blabla",
        jwt_refresh: "blabla",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Internal server error.",
    };
  }
}
