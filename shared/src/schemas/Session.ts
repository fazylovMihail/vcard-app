import z from "zod";

export const SessionSchema = z.object({
  session_id: z.string().length(21),
  user_id: z.string().length(21),
  expired_at: z.coerce.date(),
  created_at: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;

export const SessionCreateSchema = SessionSchema.pick({
  session_id: true,
  user_id: true,
});

export type SessionCreate = z.infer<typeof SessionCreateSchema>;

export const SessionIdSchema = SessionSchema.pick({ session_id: true });

export type SessionId = z.infer<typeof SessionIdSchema>;
