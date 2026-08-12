import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { errorMiddleware, strictResponse } from "./shared/middlewares";
import apiRoute from "./features";

const app = new Hono(); // app

// middlewares
app.use(strictResponse());

// routes
app.route("/api", apiRoute);

// error handler
app.onError(errorMiddleware);

// dev mode
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT ?? 4000;

  serve({
    fetch: app.fetch,
    port: Number(PORT),
  });
}

export default app;
