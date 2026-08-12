import knex, { Knex } from "knex";
import { AuthService } from "./service";
import { createTracker, MockClient, Tracker } from "knex-mock-client";
import { compare, hashSync } from "bcrypt";
import { AppError, APP_ERRORS } from "@shared/models/AppError";

jest.mock("bcrypt", () => ({ compare: jest.fn(), hashSync: jest.fn() }));

describe("AuthService", () => {
  let mockedDb: Knex;
  let tracker: Tracker;
  let authService: AuthService;

  const mockedId = "111111111111111111111";

  beforeEach(() => {
    mockedDb = knex({ client: MockClient });

    tracker = createTracker(mockedDb);
    authService = new AuthService(mockedDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tracker.reset();
  });

  describe("login", () => {
    const mockedUserCreatedAt = new Date(2010, 10, 2);

    it.each([
      {
        scenario: "invalid username",
        inputUsername: "invalid_user",
        inputPassword: "password",
        dbResponse: undefined,
        isPasswordCorrect: false,
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
          created_at: mockedUserCreatedAt,
        },
        isPasswordCorrect: false,
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
          created_at: mockedUserCreatedAt,
        },
        isPasswordCorrect: true,
        isSuccess: true,
      },
    ])(
      "The login scenarios must be tested: $scenario",
      async ({
        inputUsername,
        inputPassword,
        dbResponse,
        isPasswordCorrect,
        isSuccess,
      }) => {
        tracker.on.select("users").responseOnce(dbResponse);
        tracker.on.insert("sessions").responseOnce([{ session_id: mockedId }]);

        (compare as jest.Mock).mockResolvedValue(isPasswordCorrect);

        const resultPromise = authService.login({
          username: inputUsername,
          password: inputPassword,
        });

        if (isSuccess) {
          const result = await resultPromise;

          expect(result).toEqual({
            sessionId: mockedId,
            user: {
              id: mockedId,
              username: inputUsername,
            },
          });
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
        scenario: "session invalid",
        sessionId: "invalid_id",
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
      "must handle logout scenarios: $scenario",
      async ({ sessionId, dbResponse, isSuccess }) => {
        tracker.on.delete("sessions").responseOnce(dbResponse);

        const resultPromise = authService.logout({ session_id: sessionId });

        if (isSuccess) {
          await expect(resultPromise).resolves.toBeUndefined();
        } else {
          await expect(resultPromise).rejects.toEqual(
            new AppError(APP_ERRORS.SESSION_EXPIRED)
          );
        }
      }
    );
  });
});
