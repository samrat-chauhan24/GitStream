export function decodeBase64(encoded: string): string {
  const binary = atob(encoded.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}