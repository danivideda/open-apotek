import jwt from "jsonwebtoken";
import { loginUserDTO } from "../dto";

const ACCESS_TOKEN = "at-secret"
const REFRESH_TOKEN = "rt-secret"

export async function POST(req: Request) {
  const request = loginUserDTO.safeParse(await req.json());
  if (!request.success) {
    const { errors } = request.error;
    return Response.json(
      {
        message: { message: "Invalid request", errors },
      },
      {
        status: 400,
      }
    );
  }

  const payload = {
    username: request.data.username,
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "5s" });

  return Response.json(
    {
      accessToken,
      refreshToken
    },
    { status: 200 }
  );
}
