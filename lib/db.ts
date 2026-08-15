import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

export const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const conn = process.env.DATABASE_URL;
  if (!conn) throw new Error("DATABASE_URL environment variable is not set");
  _sql = neon(conn);
  return _sql;
}

// Lazy initializer: the Neon client is only created on first query,
// not at module load time. This allows the module to be imported during
// Next.js build (e.g. "Collecting page data") without DATABASE_URL set.
// All pages wrap `sql` calls in try/catch, so runtime errors are handled.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  function () {} as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      return (getSql() as any)(...args);
    },
    get(_target, prop) {
      const value = Reflect.get(getSql() as any, prop);
      return typeof value === "function"
        ? value.bind(getSql())
        : value;
    },
  }
) as NeonQueryFunction<false, false>;

