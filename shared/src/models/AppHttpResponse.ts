import z from "zod";
import type { StatusCode } from "hono/utils/http-status";

export const createAppHttpResponseSchema = <T extends z.ZodType>(itemSchema: T) => {
  return z.object({
    success: z.boolean(),
    status: z.number() as z.ZodType<StatusCode>,
    data: itemSchema,
  });
};

export interface AppHttpResponse<T> {
  success: boolean;
  status: StatusCode;
  data: T;
}
