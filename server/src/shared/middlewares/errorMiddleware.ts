import { APP_ERRORS, AppError } from "@shared/models/AppError";
import { sendHttpError } from "@shared/models/AppHttpResponse";
import { logger } from "@shared/models/logger";
import { ErrorHandler } from "hono";
import { ZodError } from "zod";

export const errorMiddleware: ErrorHandler = (err, c) => {
  logger.error(err);

  if (err instanceof AppError) {
    switch (err.message) {
      case APP_ERRORS.AUTH_FAILED.message:
        return sendHttpError(c, APP_ERRORS.AUTH_FAILED);
      case APP_ERRORS.SESSION_EXPIRED.message:
        return sendHttpError(c, APP_ERRORS.SESSION_EXPIRED);
      case APP_ERRORS.NOT_FOUND.message:
        return sendHttpError(c, APP_ERRORS.NOT_FOUND);

      default:
        return sendHttpError(c, APP_ERRORS.VALIDATION_FAILED);
    }
  }

  if (err instanceof ZodError) {
    return sendHttpError(c, APP_ERRORS.VALIDATION_FAILED);
  }

  return sendHttpError(c, APP_ERRORS.INTERNAL_SERVER);
};
