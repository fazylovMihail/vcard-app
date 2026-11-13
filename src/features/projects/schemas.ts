import z from "zod";
import { idSchema } from "@/lib/schemas/id";

export const ProjectSchema = z.object({
  id: idSchema,
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  ghUrl: z.url("Invalid GitHub URL"),
  deployUrl: z.url("Invalid deployment URL"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
