import { Hono } from "hono";
import { strictResponse } from "./shared/middlewares";

const app = new Hono(); // app

// middlewares
app.use(strictResponse());

// routes

export default app;
