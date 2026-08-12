import { z } from "zod";
import type { StatusCode } from "hono/utils/http-status";
import { Context } from "hono";
import { AppErrorStructure } from "./AppError";

const statusCodeSchema = z.number() as z.ZodType<StatusCode>;

const successResponseSchema = z.object({
  success: z.literal(true),
  status: statusCodeSchema,
  data: z.unknown().optional(),
});

const errorResponseSchema = z.object({
  success: z.literal(false),
  status: statusCodeSchema,
  code: z.string(),
  data: z
    .object({
      message: z.string(),
    })
    .optional(),
});

export const appResponseSchema = z.discriminatedUnion("success", [
  successResponseSchema,
  errorResponseSchema,
]);

export interface AppHttpSuccessResponse<T = undefined> {
  success: true;
  status: StatusCode;
  data?: T;
}

export interface AppHttpErrorResponse {
  success: false;
  status: StatusCode;
  code: string;
  data?: { message: string };
}

export type AppHttpResponse<T = undefined> =
  AppHttpSuccessResponse<T> | AppHttpErrorResponse;

export const create204Response = (c: Context): Response => {
  return c.newResponse(null, 204);
};

export function sendHttpError(c: Context, errorConfig: AppErrorStructure) {
  const errorBody: AppHttpErrorResponse = {
    success: false,
    status: errorConfig.status,
    code: errorConfig.code,
    data: { message: errorConfig.message },
  };

  return c.json(errorBody, errorConfig.status);
}
