import db from "@/shared/database";
import { AuthService } from "./auth.service";
import { AppContext } from "@/shared/utils-types";
import { UserLogin, LoginResponse } from "@shared/schemas/User";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/shared/constants";
import { IdSchema } from "@shared/schemas/Id";
import { HonoServerResponse } from "@shared/schemas/appResponse";

export class AuthController {
  private readonly authService = new AuthService(db);

  public login = async (c: AppContext<UserLogin>): HonoServerResponse<LoginResponse> => {
    const data = c.req.valid("json");
    const { sessionId, username } = await this.authService.login(data);

    setCookie(c, SESSION_COOKIE_NAME, sessionId, SESSION_COOKIE_OPTIONS);

    return c.json({ data: username }, 200);
  };

  public logout = async (c: AppContext): HonoServerResponse => {
    const data = getCookie(c, SESSION_COOKIE_NAME);

    const cookie = IdSchema.parse(data);

    await this.authService.logout(cookie);

    deleteCookie(c, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

    return c.body(null, 204);
  };
}
