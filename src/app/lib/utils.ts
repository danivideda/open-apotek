import jwt from "jsonwebtoken";

export function artificialDelay(miliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

export function generateAccessToken(username: string) {
  return jwt.sign({ username }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "5m",
  });
}

export function generateRefreshToken(username: string) {
  return jwt.sign({ username }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "12h",
  });
}