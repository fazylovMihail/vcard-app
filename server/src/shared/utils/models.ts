import { SessionSchema } from "@shared/models/Sesssion";
import { ReturningUserSchema } from "@shared/models/User";
import z from "zod";

export const LoginSchema = z.object({
  sessionId: SessionSchema.shape.session_id,
  user: ReturningUserSchema,
});

export type Login = z.infer<typeof LoginSchema>;
