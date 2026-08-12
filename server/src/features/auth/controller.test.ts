import knex from "knex";
import { createTracker, MockClient } from "knex-mock-client";
import { hashSync } from "bcrypt";

const mockedDb = knex({ client: MockClient });

jest.mock("@/shared/database", () => ({
  __esModule: true,
  default: mockedDb,
}));

import app from "@/server";
import { AppHttpResponse, appResponseSchema } from "@shared/models/AppHttpResponse";

describe("AuthController", () => {
  const tracker = createTracker(mockedDb);
  const mockedId = "111111111111111111111";

  beforeEach(() => {
    tracker.reset();
  });

  describe("login", () => {
    const mockedCreatedAt = new Date(2010, 10, 2);

    it.each([
      {
        scenario: "invalid username",
        inputUsername: "invalid_user",
        inputPassword: "password",
        dbResponse: undefined,
        isSuccess: false,
      },
      {
        scenario: "invalid password",
        inputUsername: "valid_user",
        inputPassword: "password",
        dbResponse: {
          id: mockedId,
          username: "valid_user",
          password: "111111111111111111111111111111111111111111111111111111111111",
          created_at: mockedCreatedAt,
        },
        isSuccess: false,
      },
      {
        scenario: "both valid",
        inputUsername: "valid_user",
        inputPassword: "password",
        dbResponse: {
          id: mockedId,
          username: "valid_user",
          password: hashSync("password", 10),
          created_at: mockedCreatedAt,
        },
        isSuccess: true,
      },
    ])(
      "must return the appropriate status and cookie, depending on the scenario: $scenario",
      async ({ inputUsername, inputPassword, dbResponse, isSuccess }) => {
        tracker.on.select("users").responseOnce(dbResponse);
        tracker.on.insert("sessions").responseOnce([{ session_id: mockedId }]);

        const response = await app.request("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: inputUsername, password: inputPassword }),
        });

        const result = (await response.json()) as AppHttpResponse;

        expect(response.status).toBe(isSuccess ? 200 : 401);

        if (isSuccess) {
          const parsedResult = appResponseSchema.safeParse(result);

          expect(parsedResult.success).toBe(true);

          const cookieHeader = response.headers.get("Set-Cookie");
          expect(cookieHeader).toContain(mockedId);
        }
      }
    );

    it("must return a 400 status for invalid user data", async () => {
      const response = await app.request("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "", password: "invalid" }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("logout", () => {
    it.each([
      {
        scenario: "session undefined",
        sessionId: mockedId,
        dbResponse: 0,
        isSuccess: false,
      },
      {
        scenario: "session deleted",
        sessionId: mockedId,
        dbResponse: 1,
        isSuccess: true,
      },
    ])(
      "must return a status based on the scenario and delete the cookie upon success: $scenario",
      async ({ sessionId, dbResponse, isSuccess }) => {
        tracker.on.delete("sessions").responseOnce(dbResponse);

        const response = await app.request("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

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
      const response = await app.request("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: "invalid_id" }),
      });

      expect(response.status).toBe(400);
    });
  });
});
