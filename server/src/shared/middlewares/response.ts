import type { MiddlewareHandler, Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type ValidAppResponse =
  | { success: boolean; status: ContentfulStatusCode }
  | { success: boolean; status: ContentfulStatusCode; data: unknown }
  | {
      success: false;
      status: HTTPException["status"];
      message: HTTPException["message"];
    };

export type AppContext = Context & {
  send(object: ValidAppResponse, status?: ContentfulStatusCode): Response;
};

export const strictResponse = (): MiddlewareHandler => {
  return async (c, next) => {
    const ctx = c as AppContext;

    ctx.send = (obj, status) => {
      const finalStatus = status ?? obj.status;
      return c.json(obj, finalStatus);
    };

    await next();
  };
};
