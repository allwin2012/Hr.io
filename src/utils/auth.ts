// src/utils/auth.ts
type TimerId = number | null;

/** Parse JWT payload (base64url) — returns null on failure */
function parseJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to parse JWT payload', e);
    return null;
  }
}

/** Returns true if token is expired or invalid */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = parseJwtPayload(token);
  if (!payload) return true;
  const exp = payload.exp;
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
}

/**
 * Schedule a callback to run when token expires. Returns the timeout id or null.
 * If already expired, cb is scheduled immediately (setTimeout 0) and null returned.
 */
export function scheduleAutoLogout(token: string, cb: () => void): TimerId {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    setTimeout(cb, 0);
    return null;
  }
  const expMs = payload.exp * 1000;
  const nowMs = Date.now();
  const delay = Math.max(0, expMs - nowMs);
  if (delay === 0) {
    setTimeout(cb, 0);
    return null;
  }
  const id = window.setTimeout(cb, delay);
  return id;
}
