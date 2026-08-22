import { TypedResponse } from "hono";

export interface AppResponse<T = null> {
  data: T;
}

export type HonoServerResponse<T = null> = T extends null
  ? Promise<Response & TypedResponse<null, 201 | 204, "body">>
  : Promise<TypedResponse<AppResponse<T>>>;
