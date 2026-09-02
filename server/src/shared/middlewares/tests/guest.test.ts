import { AppEnv } from "@/shared/utils-types";
import { Hono } from "hono";
import { guestMiddleware } from "../auth";

describe("guestMiddleware", () => {
  it("should return a 400 error if the userId variable is missing", async () => {
    const mockedId = "111111111111111111111";
    const app = new Hono<AppEnv>();

    app.use(async (c, next) => {
      c.set("userId", mockedId);
      await next();
    });

    app.use(guestMiddleware);

    app.get("/test", (c) => c.text("success"));

    const response = await app.request("/test");

    expect(response.status).toBe(400);
  });

  it("must call next if the userId variable is missing", async () => {
    const nextSpy = jest.fn();

    const app = new Hono<AppEnv>();

    app.use(guestMiddleware);

    app.get("/test", (c) => {
      nextSpy();
      return c.text("success");
    });

    await app.request("/test");

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
