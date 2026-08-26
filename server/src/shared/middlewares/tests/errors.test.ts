import { APP_ERRORS, AppError } from "@shared/appError";
import { Hono } from "hono";
import { AppEnv } from "../../utils-types";
import { errorMiddleware } from "../errors";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

describe("errors Middleware", () => {
  let app: Hono<AppEnv>;

  beforeEach(() => {
    app = new Hono<AppEnv>();
    app.onError(errorMiddleware);
  });

  it("must return an error corresponding to the AppError passed to it by default", async () => {
    const mockedAppErrors = Object.values(APP_ERRORS);

    app.get("/test/:errorIndex", (c) => {
      const errorIndex = Number(c.req.param("errorIndex"));
      const error = mockedAppErrors[errorIndex];
      throw new AppError(error);
    });

    for (let i = 0; i < mockedAppErrors.length; i++) {
      const response = await app.request(`/test/${String(i)}`);
      expect(response.status).toBe(mockedAppErrors[i].status);
    }
  });

  it("must return a 400 error if it is a zodError", async () => {
    const TestSchema = z.string().min(8);

    app.post("/test", zValidator("json", TestSchema));

    const response = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("invalid"),
    });

    expect(response.status).toBe(400);
  });

  it("must return a 500 error if no error matched", async () => {
    app.get("/test", () => {
      throw new Error();
    });

    const response = await app.request("/test");

    expect(response.status).toBe(500);
  });
});
