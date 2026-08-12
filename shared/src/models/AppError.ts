export const APP_ERRORS = {
  AUTH_FAILED: {
    status: 401,
    message: "Invalid username or password.",
    code: "AUTH_001",
  },
  SESSION_EXPIRED: {
    status: 401,
    message: "Session is invalid or has already expired.",
    code: "AUTH_003",
  },
  VALIDATION_FAILED: {
    status: 400,
    message: "Data is invalid.",
    code: "VALIDATION_002",
  },
  NOT_FOUND: {
    status: 404,
    message: "Resource not found.",
    code: "NOT_FOUND_003",
  },
  INTERNAL_SERVER: {
    status: 500,
    message: "Internal server error.",
    code: "ITERNAL_001",
  },
} as const;

export type AppErrorKey = keyof typeof APP_ERRORS;

export type AppErrorStructure = (typeof APP_ERRORS)[AppErrorKey];

export type AppErrorCode = (typeof APP_ERRORS)[AppErrorKey]["code"];

export class AppError extends Error {
  public readonly code: string;

  constructor(config: AppErrorStructure) {
    super(config.message);
    this.code = config.code;
    this.name = "AppError";
  }
}
