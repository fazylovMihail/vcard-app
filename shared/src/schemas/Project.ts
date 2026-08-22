import z from "zod";

export const ProjectSchema = z.object({
  id: z.string().length(21),
  title: z.string().min(1).max(255),
  content: z.string().max(10000).optional(),
  real_created_at: z.coerce.date().or(z.string()).optional(),
  gh_url: z.string().min(1).max(2048),
  deploy_url: z.string().max(2048).optional(),
  created_at: z.coerce.date().or(z.string()),
  updated_at: z.coerce.date().or(z.string()),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsListSchema = z.array(ProjectSchema);

export type ProjectsList = z.infer<typeof ProjectsListSchema>;

export const ProjectPayloadSchema = ProjectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type ProjectPayload = z.infer<typeof ProjectPayloadSchema>;
