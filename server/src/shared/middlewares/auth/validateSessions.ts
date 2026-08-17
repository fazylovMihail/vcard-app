import { Next } from "hono";
import { AppContext } from "../../utils-types";
import { deleteCookie, getCookie } from "hono/cookie";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "../../constants";
import db from "../../database";
import { User } from "@shared/schemas/User";

export default async function validateSessions(c: AppContext, next: Next) {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) return next();

  const now = new Date();

  const user = await db("sessions")
    .join("users", "sessions.user_id", "=", "users.id")
    .where("sessions.session_id", sessionId)
    .andWhere("sessions.expired_at", ">", now)
    .select("users.id", "users.username")
    .first<User | undefined>();

  if (!user) {
    deleteCookie(c, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
    return next();
  }

  c.set("userId", user.id);

  await next();
}
