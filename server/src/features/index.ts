import { Hono } from "hono";
import authRoute from "./auth";

const route = new Hono();

route.route("/auth", authRoute);

export default route;
