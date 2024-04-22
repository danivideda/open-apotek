import { NextResponse } from "next/server";

export enum ResponseStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  InternalError = 500,
}

export function createResponse(
  status: ResponseStatus,
  message: string,
  data?: any
) {
  return NextResponse.json(
    {
      message,
      data,
    },
    {
      status,
    }
  );
}
