import z from "zod";

export const IdSchema = z.string().length(21);

export type Id = z.infer<typeof IdSchema>;
