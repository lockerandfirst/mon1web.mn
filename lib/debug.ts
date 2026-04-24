/**
 * Client-side debug logger.
 * `NEXT_PUBLIC_DEBUG=true` эсвэл development орчинд идэвхтэй.
 */
const enabled = () =>
  process.env.NEXT_PUBLIC_DEBUG === "true" ||
  process.env.NODE_ENV !== "production";

type Scope = string;

function formatExtra(extra: unknown) {
  if (extra === undefined) return "";
  if (typeof extra === "string") return extra;
  try {
    return JSON.stringify(extra);
  } catch {
    return String(extra);
  }
}

export const debug = {
  log(scope: Scope, msg: string, extra?: unknown) {
    if (!enabled()) return;
    console.log(`[${scope}] ${msg}`, formatExtra(extra));
  },
  warn(scope: Scope, msg: string, extra?: unknown) {
    if (!enabled()) return;
    console.warn(`[${scope}] ${msg}`, formatExtra(extra));
  },
  error(scope: Scope, msg: string, extra?: unknown) {
    console.error(`[${scope}] ${msg}`, formatExtra(extra));
  },
};
