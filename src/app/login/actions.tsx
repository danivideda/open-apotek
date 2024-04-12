"use server";

import { z } from "zod";
import { handleAuth } from "../lib/auth";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export async function login(prevState: any, formData: FormData) {
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
    console.log(zodParsed.error.message);
    return "Please check again";
  }

  const { username, password } = zodParsed.data;
  const response = await handleAuth(username, password);
  if (!response.success) {
    return response.error;
  }

  const {jwt_access, jwt_refresh, expires} = response.payload

  cookies().set("session", jwt_refresh, { expires, httpOnly: true, path: '/auth' });
  return redirect("/");
}
