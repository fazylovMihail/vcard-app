import db from "@/shared/database";
import { AuthService } from "./auth.service";
import { AppContext } from "@/shared/utils-types";
import { UserLogin } from "@shared/schemas/User";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/shared/constants";
import { TypedResponse } from "hono";
import { HttpLoginReponse } from "@shared/schemas/responses/auth";
import { IdSchema } from "@shared/schemas/Id";

export class AuthController {
  private readonly authService = new AuthService(db);

  public login = async (
    c: AppContext<UserLogin>
  ): Promise<TypedResponse<HttpLoginReponse>> => {
    const data = c.req.valid("json");
    const { sessionId, username } = await this.authService.login(data);

    setCookie(c, SESSION_COOKIE_NAME, sessionId, SESSION_COOKIE_OPTIONS);

    return c.json({ username }, 200);
  };

  public logout = async (c: AppContext) => {
    const data = getCookie(c, SESSION_COOKIE_NAME);

    const cookie = IdSchema.parse(data);

    await this.authService.logout(cookie);

    deleteCookie(c, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

    return c.body(null, 204);
  };
}
