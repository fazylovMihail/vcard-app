import type { Context, Env } from "hono";

export type ControllerContext<JSONInput = unknown> = Context<
  Env,
  string,
  { in: { json: JSONInput }; out: { json: unknown } }
>;
