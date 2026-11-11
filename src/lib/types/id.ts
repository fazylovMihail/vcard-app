import z from "zod";
import { idSchema } from "../schemas/id";

export type Id = z.infer<typeof idSchema>;
