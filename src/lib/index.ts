import "server-only";

export * from "./jwt";
export * from "./response";
export * from "./auth";
export function artificialDelay(miliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
