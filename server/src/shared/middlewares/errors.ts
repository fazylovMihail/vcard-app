import { APP_ERRORS, AppError, sendHttpError } from "@shared/appError";
import { AppErrorHandler } from "../utils-types";
import z from "zod";
import { logger } from "@shared/logger";

export const errorMiddleware: AppErrorHandler = (err, c) => {
  logger.error(err);

  if (err instanceof AppError) {
    const appError = Object.values(APP_ERRORS).find((error) => err.code === error.code);
    if (appError) {
      return sendHttpError(c, appError);
    }
  }

  if (err instanceof z.ZodError) {
    return sendHttpError(c, APP_ERRORS.VALIDATION_FAILED);
  }

  return sendHttpError(c, APP_ERRORS.INTERNAL_SERVER);
};
