import { Context, Env } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const APP_ERRORS = {
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
    code: "VALIDATION_001",
  },
  VALIDATION_FAILED: {
    status: 400,
    message: "Data is invalid.",
    code: "VALIDATION_002",
  },
  GUEST_MIDDLEWARE_FAILED: {
    status: 400,
    message: "You are already logged in.",
    code: "AUTH_003",
  },
  DATABASE_FAILED: {
    status: 200,
    message: "Database error",
    code: "DB_001",
  },
  AUTH_FAILED: {
    status: 401,
    message: "Invalid username or password.",
    code: "AUTH_001",
  },
  SESSION_EXPIRED: {
    status: 401,
    message: "Session is invalid or has already expired.",
    code: "AUTH_002",
  },
  AUTH_MIDDLEWARE_FAILED: {
    status: 401,
    message: "You are not logged in.",
    code: "AUTH_004",
  },
  NOT_FOUND: {
    status: 404,
    message: "Resource not found.",
    code: "NOT_FOUND_003",
  },
  INTERNAL_SERVER: {
    status: 500,
    message: "Internal server error.",
    code: "INTERNAL_001",
  },
} as const;

export type AppErrorStructure = (typeof APP_ERRORS)[keyof typeof APP_ERRORS];

export class AppError extends Error {
  public readonly code: string;

  constructor(config: AppErrorStructure) {
    super(config.message);
    this.code = config.code;
    this.name = "AppError";
  }
}

export function sendHttpError<E extends Env>(c: Context<E>, error: AppErrorStructure) {
  const status = error.status as ContentfulStatusCode;
  return c.json(error, status);
}
