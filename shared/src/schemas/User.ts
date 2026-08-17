import z from "zod";
import { IdSchema } from "./Id";

export const UserSchema = z.object({
  id: IdSchema,
  username: z.string().min(1).max(255),
  password: z.string().min(8).max(255),
  created_at: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersListSchema = z.array(UserSchema);

export type UsersList = z.infer<typeof UsersListSchema>;

export const UserLoginSchema = UserSchema.pick({ username: true, password: true });

export type UserLogin = z.infer<typeof UserLoginSchema>;
