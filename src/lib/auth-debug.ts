type DebugMeta = Record<string, unknown>;

export function isAuthDebugEnabled(): boolean {
  const value = process.env.AUTH_DEBUG ?? "";
  return value === "1" || value.toLowerCase() === "true";
}

export function maskToken(token?: string): string {
  if (!token) return "none";
  if (token.length <= 16) return `${token.slice(0, 4)}...(${token.length})`;
  return `${token.slice(0, 8)}...${token.slice(-8)}(${token.length})`;
}

export function serverAuthLog(
  scope: string,
  message: string,
  meta?: DebugMeta
): void {
  if (!isAuthDebugEnabled()) return;
  const payload = {
    time: new Date().toISOString(),
    scope,
    message,
    ...meta,
  };
}
