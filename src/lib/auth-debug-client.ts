type DebugMeta = Record<string, unknown>;

declare global {
  interface Window {
    __AUTH_DEBUG_EVENTS__?: Array<Record<string, unknown>>;
  }
}

function isClientAuthDebugEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_AUTH_DEBUG ?? "";
  return value === "1" || value.toLowerCase() === "true";
}

export function clientAuthLog(
  scope: string,
  message: string,
  meta?: DebugMeta
): void {
  if (!isClientAuthDebugEnabled() || typeof window === "undefined") return;
  const event = {
    time: new Date().toISOString(),
    scope,
    message,
    ...meta,
  };
  window.__AUTH_DEBUG_EVENTS__ = window.__AUTH_DEBUG_EVENTS__ ?? [];
  window.__AUTH_DEBUG_EVENTS__.push(event);
  console.info("[AUTH_DEBUG]", event);
}
