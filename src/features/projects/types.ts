import z from "zod";
import {
  createProjectSchema,
  updateProjectSchema,
  ProjectSchema,
} from "./schemas";

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
