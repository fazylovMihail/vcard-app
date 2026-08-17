import z from "zod";
import { UserSchema } from "../User";

export const HttpLoginReponseSchema = z.object({
  username: UserSchema.shape.username,
});

export type HttpLoginReponse = z.infer<typeof HttpLoginReponseSchema>;
