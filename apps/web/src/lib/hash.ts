export function djb2(input: string) {
  let hash = 5381;
  for (const char of input) {
    hash = (hash << 5) + hash + char.charCodeAt(0);
  }
  return Math.abs(hash).toString(16);
}
