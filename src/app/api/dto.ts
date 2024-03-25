import { z } from "zod";

export const loginUserDTO = z.object({
  username: z.string(),
  password: z.string(),
});
