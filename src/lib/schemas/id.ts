import z from "zod";

export const idSchema = z.number().int().positive("ID is required");
