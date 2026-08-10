import z from "zod";
import { IdSchema } from "./utils";

export const SessionSchema = z.object({
  session_id: IdSchema,
  user_id: IdSchema,
  created_at: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;

export const SessionsListSchema = z.array(SessionSchema);

export type SessionList = z.infer<typeof SessionsListSchema>;

export const CreateSessionSchema = SessionSchema.omit({ created_at: true });

export type CreateSession = z.infer<typeof CreateSessionSchema>;
