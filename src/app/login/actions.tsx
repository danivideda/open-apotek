"use server";

import { zfd } from "zod-form-data";
import { handleAuth } from "../lib/auth";

export async function login(prevState: any, formData: FormData) {
  const schema = zfd.formData({
    username: zfd.text(),
    password: zfd.text(),
  });

  const zodParsed = schema.safeParse(formData);
  if (zodParsed.success) {
    const { username, password } = zodParsed.data;
    const response = await handleAuth(username, password);
    return `User: ${username} successfully logged in. Message: ${response}`;
  }

return zodParsed.error.message
}
