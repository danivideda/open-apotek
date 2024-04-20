import "server-only";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function sessionTokenCookieConfig(options: {
  value: string;
  expires: Date;
}): ResponseCookie;
export function sessionTokenCookieConfig(): Omit<
  ResponseCookie,
  "value" | "expires"
>;
export function sessionTokenCookieConfig(options?: {
  value: string;
  expires: Date;
}): ResponseCookie | Omit<ResponseCookie, "value" | "expires"> {
  if (options) {
    return {
      name: "session",
      value: options.value,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: options.expires,
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
