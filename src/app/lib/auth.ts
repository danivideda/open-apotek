import "server-only";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function sessionTokenCookieConfig(options: {
  value: string;
  expires?: Date;
}): ResponseCookie;
export function sessionTokenCookieConfig(): Omit<
  ResponseCookie,
  "value" | "expires"
>;
export function sessionTokenCookieConfig(options?: {
  value: string;
  expires?: Date | undefined;
}): ResponseCookie | Omit<ResponseCookie, "value" | "expires"> {
  if (options) {
    return {
      name: "session",
      value: options.value,
      httpOnly: true,
      sameSite: "strict",
      // domain: "localhost:3000",
      path: "/",
      expires: options.expires ?? new Date(Date.now()),
    };
  } else {
    return {
      name: "session",
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    };
  }
}
