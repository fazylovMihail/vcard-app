import z from "zod";

export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServer = 500,
}

export const AppErrorSchema = z.object({
  status: z.enum(ErrorCode),
  message: z.string(),
});

export type TAppError = z.infer<typeof AppErrorSchema>;

export class AppError extends Error implements TAppError {
  public status: TAppError["status"];

  constructor(status: TAppError["status"], message: TAppError["message"]) {
    super(message);
    this.status = status;
    this.name = "AppError";

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
