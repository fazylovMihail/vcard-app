import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { AppEnv } from "./shared/utils-types";
import router from "./features";
import { validateSessions, errorMiddleware } from "./shared/middlewares";

const app = new Hono<AppEnv>();

app.use(validateSessions);

app.route("/api", router);

app.onError(errorMiddleware);

if (process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT) || 4000;
  serve({
    fetch: app.fetch,
    port: PORT,
  });
}

export default app;
