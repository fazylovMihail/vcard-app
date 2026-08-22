import { Hono } from "hono";

import authRouter from "./auth";
import projectsRouter from "./projects";

const router = new Hono();

router.route("/auth", authRouter);
router.route("/projects", projectsRouter);

export default router;
