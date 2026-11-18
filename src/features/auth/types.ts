import z from "zod";
import { loginResponseSchema, loginSchema } from "./schemas";

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
