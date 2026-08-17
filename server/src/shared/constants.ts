import { CookieOptions } from "hono/utils/cookie";

export const SESSION_COOKIE_NAME = "auth_session";

export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  maxAge: 3 * 24 * 60 * 60,
  sameSite: "Lax",
};
