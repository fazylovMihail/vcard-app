import { User } from "@shared/schemas/User";
import { Context, Env } from "hono";

export interface AppEnv extends Env {
  Variables: {
    userId?: User["username"];
  };
}

export type AppContext<T = unknown> = Context<
  AppEnv,
  string,
  { in: { json: T }; out: { json: T } }
>;

export type AppErrorHandler = (err: Error, c: AppContext) => Response | Promise<Response>;
