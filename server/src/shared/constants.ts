import { CookieOptions } from "hono/utils/cookie";

export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  maxAge: 259200,
  sameSite: "Lax",
};

export const SESSION_COOKIE_NAME = "user_cookie";
