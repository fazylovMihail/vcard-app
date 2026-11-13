import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").max(255, "Max 255 symbols"),
  code: z.string().length(60),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const loginSchema = userSchema.pick({ code: true });

export const loginResponseSchema = z.object({
  user: userSchema.pick({ id: true, name: true }),
});
