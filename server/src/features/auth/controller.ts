import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/shared/constants";
import { AuthService } from "./service";
import { ControllerContext } from "@/shared/utils/types";
import { UserLogin } from "@shared/models/User";
import { deleteCookie, setCookie } from "hono/cookie";
import { create204Response } from "@shared/models/AppHttpResponse";
import db from "@/shared/database";
import { ReturningSession } from "@shared/models/Sesssion";

export class AuthController {
  private readonly authService = new AuthService(db);

  public login = async (c: ControllerContext<UserLogin>): Promise<Response> => {
    const data = c.req.valid("json") as UserLogin;
    const {
      sessionId,
      user: { id, username },
    } = await this.authService.login(data);

    setCookie(c, SESSION_COOKIE_NAME, sessionId, SESSION_COOKIE_OPTIONS);

    return c.json({ success: true, status: 200, data: { id, username } });
  };

  public logout = async (c: ControllerContext<ReturningSession>): Promise<Response> => {
    const data = c.req.valid("json") as ReturningSession;
    await this.authService.logout(data);

    deleteCookie(c, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

    return create204Response(c);
  };
}
