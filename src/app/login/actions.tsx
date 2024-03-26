"use server";
import { revalidatePath } from "next/cache";

export async function login(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    console.log("1 second has passed");
  });
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  revalidatePath("/login");
  return `Username: ${data.username} and password: ${data.password}`;
}
