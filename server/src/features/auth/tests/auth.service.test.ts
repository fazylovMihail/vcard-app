import knex, { Knex } from "knex";
import { AuthService, LoginSchema } from "../auth.service";
import { createTracker, MockClient, Tracker } from "knex-mock-client";
import { compare, hashSync } from "bcrypt";
import { APP_ERRORS, AppError } from "@shared/appError";

jest.mock("bcrypt", () => ({ compare: jest.fn(), hashSync: jest.fn() }));

describe("AuthService", () => {
  let mockedDb: Knex;
  let authService: AuthService;
  let tracker: Tracker;

  const mockedId = "111111111111111111111";

  beforeEach(() => {
    mockedDb = knex({ client: MockClient });

    authService = new AuthService(mockedDb);
    tracker = createTracker(mockedDb);
  });

  describe("login", () => {
    const mockedUserCreatedAt = new Date(2010, 10, 2);
    const mockedUsername = {
      valid: "valid_user",
      invalid: "invalid_user",
    };

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
      "must provide a response depending on the scenario: $scenario",
      async ({ inputUsername, inputPassword, dbResponse, isPasswordCorrect }) => {
        tracker.on.select("users").responseOnce(dbResponse);
        tracker.on.insert("sessions").responseOnce([{ session_id: mockedId }]);

        (compare as jest.Mock).mockResolvedValue(isPasswordCorrect);

        const resultPromise = authService.login({
          username: inputUsername,
          password: inputPassword,
        });

        if (isPasswordCorrect) {
          const result = await resultPromise;

          const parsedResult = LoginSchema.safeParse(result);
          expect(parsedResult.success).toBe(true);
        } else {
          await expect(resultPromise).rejects.toThrow(
            new AppError(APP_ERRORS.AUTH_FAILED)
          );
        }
      }
    );
  });

  describe("logout", () => {
    it.each([
      {
        scenario: "session undefined",
        inputSessionId: mockedId,
        dbResponse: 0,
        isSuccess: false,
      },
      {
        scenario: "session deleted",
        inputSessionId: mockedId,
        dbResponse: 1,
        isSuccess: true,
      },
    ])(
      "must return a response depending on the scenario: $scenario",
      async ({ inputSessionId, dbResponse, isSuccess }) => {
        tracker.on.delete("sessions").responseOnce(dbResponse);
        const authPromise = authService.logout(inputSessionId);

        if (isSuccess) {
          await expect(authPromise).resolves.toBeUndefined();
        } else {
          await expect(authPromise).rejects.toThrow(
            new AppError(APP_ERRORS.SESSION_EXPIRED)
          );
        }
      }
    );
  });
});
