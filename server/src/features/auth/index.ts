import { Hono } from "hono";
import { AuthController } from "./auth.controller";
import { zValidator } from "@hono/zod-validator";
import { UserLoginSchema } from "@shared/schemas/User";
import { authorizedMiddleware, guestMiddleware } from "@/shared/middlewares";
import { AppEnv } from "@/shared/utils-types";

const router = new Hono<AppEnv>();
const authController = new AuthController();

router.post(
  "/login",
  guestMiddleware,
  zValidator("json", UserLoginSchema),
  authController.login
);
router.post("/logout", authorizedMiddleware, authController.logout);

export default router;
