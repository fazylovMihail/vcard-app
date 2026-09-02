import { createTracker, MockClient } from "knex-mock-client";
import knex from "knex";
import { hashSync } from "bcrypt";
import { LoginResponse, LoginResponseSchema } from "@shared/schemas/User";
import { SESSION_COOKIE_NAME } from "@/shared/constants";
import { AppResponse } from "@shared/schemas/appResponse";

const mockedDb = knex({ client: MockClient });

jest.mock("@/shared/database", () => ({
  __esModule: true,
  default: mockedDb,
}));

import app from "@/server";

const createAppRequest = (endpoint: string, body?: BodyInit, headers?: HeadersInit) => {
  return app.request(`/api/auth/${endpoint}`, {
    method: "POST",
    headers: headers ?? { "Content-Type": "application/json" },
    body,
  });
};

describe("AuthController", () => {
  const tracker = createTracker(mockedDb);
  const mockedId = "111111111111111111111";
  const mockedUserCreatedAt = new Date(2010, 10, 2);
  const mockedUsername = {
    valid: "valid_user",
    invalid: "invalid_user",
  };

  beforeEach(() => {
    tracker.reset();
  });

  describe("login", () => {
    it.each([
      {
        scenario: "invalid username",
        inputUsername: mockedUsername.invalid,
        inputPassword: "password",
        isPasswordCorrect: false,
      },
      {
        scenario: "invalid password",
        inputUsername: mockedUsername.valid,
        inputPassword: "password",
        dbResponse: {
          id: mockedId,
          username: mockedUsername.valid,
          password: "111111111111111111111111111111111111111111111111111111111111",
          created_at: mockedUserCreatedAt,
        },
        isPasswordCorrect: false,
      },
      {
        scenario: "both valid",
        inputUsername: mockedUsername.valid,
        inputPassword: "password",
        dbResponse: {
          id: mockedId,
          username: mockedUsername.valid,
          password: hashSync("password", 10),
          created_at: mockedUserCreatedAt,
        },
        isPasswordCorrect: true,
      },
    ])(
      "must return the status and create cookies depending on the scenario: $scenario",
      async ({ inputUsername, inputPassword, dbResponse, isPasswordCorrect }) => {
        tracker.on.select("users").responseOnce(dbResponse);
        tracker.on.insert("sessions").responseOnce([{ session_id: mockedId }]);

        const response = await createAppRequest(
          "login",
          JSON.stringify({ username: inputUsername, password: inputPassword })
        );

        const result = (await response.json()) as AppResponse<LoginResponse>;

        expect(response.status).toBe(isPasswordCorrect ? 200 : 401);

        if (isPasswordCorrect) {
          const parsedResult = LoginResponseSchema.safeParse(result.data);

          expect(parsedResult.success).toBe(true);

          const cookieHeader = response.headers.get("Set-Cookie");
          expect(cookieHeader).toContain(mockedId);
        }
      }
    );
    it("must return a 400 status for invalid user data", async () => {
      const response = await createAppRequest(
        "login",
        JSON.stringify({ username: "", password: "invalid" })
      );

      expect(response.status).toBe(400);
    });
    it("should return a 400 error if the user is already logged in", async () => {
      const headers: HeadersInit = { Cookie: `${SESSION_COOKIE_NAME}=${mockedId}` };

      tracker.on.select("users").responseOnce({
        id: mockedId,
        username: mockedUsername.valid,
        password: hashSync("password", 10),
        created_at: mockedUserCreatedAt,
      });

      const response = await createAppRequest(
        "login",
        JSON.stringify({ username: "valid_user", password: "password" }),
        headers
      );

      expect(response.status).toBe(400);
    });
  });
  describe("logout", () => {
    it.each([
      {
        scenario: "session undefined",
        dbResponse: 0,
        isSuccess: false,
      },
      {
        scenario: "session deleted",
        dbResponse: 1,
        isSuccess: true,
      },
    ])(
      "must restore the status and delete the session, depending on the scenario: $scenario",
      async ({ dbResponse, isSuccess }) => {
        tracker.on.select("users").responseOnce({
          id: mockedId,
          username: mockedUsername.valid,
          password: hashSync("password", 10),
          created_at: mockedUserCreatedAt,
        });
        tracker.on.delete("sessions").responseOnce(dbResponse);

        const headers: HeadersInit = { Cookie: `${SESSION_COOKIE_NAME}=${mockedId}` };

        const response = await createAppRequest("logout", undefined, headers);

        if (isSuccess) {
          expect(response.status).toBe(204);

          const cookieHeaders = response.headers.get("Set-Cookie");
          expect(cookieHeaders).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/);
        } else {
          expect(response.status).toBe(401);
        }
      }
    );

    it("must return a 400 status when receiving an invalid ID", async () => {
      tracker.on.select("users").responseOnce({
        id: mockedId,
        username: mockedUsername.valid,
        password: hashSync("password", 10),
        created_at: mockedUserCreatedAt,
      });

      const headers: HeadersInit = { Cookie: `${SESSION_COOKIE_NAME}=invalid_id'` };

      const response = await createAppRequest("logout", undefined, headers);

      expect(response.status).toBe(400);
    });

    it("should return a 401 error if the user is not logged in", async () => {
      const response = await createAppRequest("logout", undefined);
      expect(response.status).toBe(401);
    });
  });
});
