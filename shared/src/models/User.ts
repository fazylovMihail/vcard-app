import z from "zod";
import { IdSchema } from "./utils";

export const UserSchema = z.object({
  id: IdSchema,
  username: z.string().min(1).max(255),
  password: z.string().length(60),
  created_at: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersListSchema = z.array(UserSchema);

export type UsersList = z.infer<typeof UsersListSchema>;

export const UserLoginSchema = UserSchema.pick({ username: true }).extend({
  password: z.string().min(8).max(255),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;

export const ReturningUserSchema = UserSchema.pick({ id: true, username: true });

export type ReturningUser = z.infer<typeof ReturningUserSchema>;
