import { APP_ERRORS, sendHttpError } from "@shared/appError";
import { AppContext } from "../../utils-types";
import { Next } from "hono";

export default async function authorizedMiddleware(c: AppContext, next: Next) {
  if (!c.var.userId) return sendHttpError(c, APP_ERRORS.AUTH_MIDDLEWARE_FAILED);
  await next();
}
