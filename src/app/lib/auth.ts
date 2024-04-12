import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function handleAuth(
  username: string,
  password: string
): Promise<
  | {
      success: true;
      message: string;
      payload: {
        jwt_access: string;
        jwt_refresh: string;
        expires: Date
      };
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const response = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (response.length === 0) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    const isPasswordValid = await argon2.verify(
      response[0].passwordHash,
      password
    );
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Wrong password.",
      };
    }

    const jwt_payload = {
      username: response[0].username,
    };

    const accessTokenTTL = 10 * 60;
    const refreshTokenTTL = 12 * 60 * 60;

    const jwt_access_token = jwt.sign(
      jwt_payload,
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: accessTokenTTL }
    );

    const jwt_refresh_token = jwt.sign(
      jwt_payload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: refreshTokenTTL }
    );

    const expires = new Date(Date.now() + refreshTokenTTL);

    return {
      success: true,
      message: "Successfully logged in.",
      payload: {
        jwt_access: jwt_access_token,
        jwt_refresh: jwt_refresh_token,
        expires
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "Internal server error.",
    };
  }
}
