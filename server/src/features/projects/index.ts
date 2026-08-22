import { Hono } from "hono";
import { ProjectsController } from "./projects.controller";
import { zValidator } from "@hono/zod-validator";
import { ProjectPayloadSchema } from "@shared/schemas/Project";
import { AppEnv } from "@/shared/utils-types";

const router = new Hono<AppEnv>();
const projectsController = new ProjectsController();

router.get("/", projectsController.getAll);
router.get("/:id", projectsController.getOne);
router.post("/", zValidator("json", ProjectPayloadSchema), projectsController.create);
router.patch("/:id", zValidator("json", ProjectPayloadSchema), projectsController.edit);
router.delete("/:id", projectsController.delete);

export default router;
