export function artificialDelay(miliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds))
}