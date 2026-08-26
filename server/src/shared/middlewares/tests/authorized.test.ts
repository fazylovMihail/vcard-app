import { AppEnv } from "@/shared/utils-types";
import { Hono } from "hono";
import { authorizedMiddleware } from "../auth";

describe("authorizedMiddleware", () => {
  it("should return a 401 error if the userId variable is not found", async () => {
    const app = new Hono<AppEnv>();

    app.use(authorizedMiddleware);

    app.get("/test", (c) => c.text("success"));

    const response = await app.request("/test");

    expect(response.status).toBe(401);
  });

  it("must call next if the userId variable is found", async () => {
    const mockedId = "111111111111111111111";
    const nextSpy = jest.fn();
    const app = new Hono<AppEnv>();

    app.use(async (c, next) => {
      c.set("userId", mockedId);
      await next();
    });

    app.use(authorizedMiddleware);

    app.get("/test", (c) => {
      nextSpy();
      return c.text("success");
    });

    await app.request("/test");

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
