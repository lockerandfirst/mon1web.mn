/**
 * Эгэл debug logger — `DEBUG=true` үед л дэлгэрэнгүй логыг үзүүлнэ.
 * Production-д чимээгүй.
 */
const enabled = () =>
  process.env.DEBUG === "true" || process.env.NODE_ENV !== "production";

type Scope = string;

function line(level: "log" | "warn" | "error", scope: Scope, msg: string, extra?: unknown) {
  const t = new Date().toISOString();
  const base = `[${t}] [${level}] [${scope}] ${msg}`;
  if (extra === undefined) {
    console[level](base);
    return;
  }
  try {
    console[level](base, typeof extra === "string" ? extra : JSON.stringify(extra));
  } catch {
    console[level](base, extra);
  }
}

export const debug = {
  log(scope: Scope, msg: string, extra?: unknown) {
    if (!enabled()) return;
    line("log", scope, msg, extra);
  },
  warn(scope: Scope, msg: string, extra?: unknown) {
    line("warn", scope, msg, extra);
  },
  error(scope: Scope, msg: string, extra?: unknown) {
    line("error", scope, msg, extra);
  },
};

/** `try/catch` wrap — алдаа гарсан scope-той дэлгэрэнгүй логыг буулгах. */
export async function withDebug<T>(
  scope: Scope,
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    debug.log(scope, `${label} ok (${Date.now() - start}ms)`);
    return result;
  } catch (error) {
    debug.error(scope, `${label} failed (${Date.now() - start}ms)`, {
      message: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}
