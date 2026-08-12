import { zValidator } from "@hono/zod-validator";
import { UserLoginSchema } from "@shared/models/User";
import { Hono } from "hono";
import { AuthController } from "./controller";
import { ReturningSessionSchema } from "@shared/models/Sesssion";

const route = new Hono();
const authController = new AuthController();

route.post("/login", zValidator("json", UserLoginSchema), authController.login);
route.post("/logout", zValidator("json", ReturningSessionSchema), authController.logout);

export default route;
