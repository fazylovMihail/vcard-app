import knex from "knex";
import { createTracker, MockClient } from "knex-mock-client";
import { deleteCookie, getCookie } from "hono/cookie";

const mockedDb = knex({ client: MockClient });

jest.mock("@/shared/database", () => ({
  __esModule: true,
  default: mockedDb,
}));
jest.mock("hono/cookie", () => ({
  getCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

import validateSessions from "./validateSessions";
import { AppContext } from "@/shared/utils-types";

describe("validateSession Middleware", () => {
  let nextSpy: jest.Mock;
  let mockContext = {
    set: jest.fn(),
  };

  const mockedId = "111111111111111111111";

  const tracker = createTracker(mockedDb);

  beforeEach(() => {
    tracker.reset();
    nextSpy = jest.fn();
    mockContext = {
      set: jest.fn(),
    };
  });

  it("must call next if the cookie is missing", async () => {
    (getCookie as jest.Mock).mockReturnValue(undefined);

    await validateSessions(mockContext as unknown as AppContext, nextSpy);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(mockContext.set).not.toHaveBeenCalled();
  });

  it("must delete cookies and call next if user is undefined", async () => {
    (getCookie as jest.Mock).mockReturnValue(mockedId);
    tracker.on.select("sessions").responseOnce(undefined);

    await validateSessions(mockContext as unknown as AppContext, nextSpy);

    expect(deleteCookie).toHaveBeenCalledWith(
      mockContext,
      expect.any(String),
      expect.any(Object)
    );
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(mockContext.set).not.toHaveBeenCalled();
  });
});
