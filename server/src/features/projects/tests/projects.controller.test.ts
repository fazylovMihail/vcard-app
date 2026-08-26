import knex from "knex";
import { createTracker, MockClient } from "knex-mock-client";
import { AppResponse } from "@shared/schemas/appResponse";
import { Project, ProjectsList } from "@shared/schemas/Project";
import { APP_ERRORS } from "@shared/appError";

const mockedDb = knex({ client: MockClient });

jest.mock("@/shared/database", () => ({
  __esModule: true,
  default: mockedDb,
}));

import app from "@/server";

const mockedId = "111111111111111111111";
const mockedCookie = `auth_user=${mockedId}; Path=/; HttpOnly`;

const createAppGetRequest = (endpoint?: string) => {
  const path = endpoint ? `/api/projects/${endpoint}` : "/api/projects";

  return app.request(path, {
    method: "GET",
    headers: { Cookie: mockedCookie },
  });
};

describe("ProjectsController", () => {
  const tracker = createTracker(mockedDb);
  const mockedProjectPayload = {
    title: "project",
    content: "project content",
    real_created_at: new Date().toISOString(),
    gh_url: "https://github.com",
    deploy_url: "https://deploy.com",
  };
  const mockedProject = {
    id: mockedId,
    ...mockedProjectPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    tracker.reset();
  });

  describe("getAll", () => {
    it("must return projects list and status 200", async () => {
      tracker.on.select("projects").responseOnce([mockedProject]);

      const response = await createAppGetRequest();
      expect(response.status).toBe(200);

      const result = (await response.json()) as AppResponse<ProjectsList>;
      expect(result.data).toEqual([mockedProject]);
    });
  });

  describe("getOne", () => {
    it.each([
      {
        scenario: "project undefined",
        inputId: mockedId,
        dbResponse: undefined,
        isSuccess: false,
      },
      {
        scenario: "success",
        inputId: mockedId,
        dbResponse: mockedProject,
        isSuccess: true,
      },
    ])(
      "It must return the status and data depending on the scenario: $scenario",
      async ({ inputId, dbResponse, isSuccess }) => {
        tracker.on.select("projects").responseOnce(dbResponse);

        const response = await createAppGetRequest(inputId);
        const body = (await response.json()) as AppResponse<Project>;

        if (isSuccess) {
          expect(response.status).toBe(200);
          expect(body.data).toEqual(dbResponse);
        } else {
          expect(response.status).toBe(404);
          expect(body).toEqual(APP_ERRORS.NOT_FOUND);
        }
      }
    );
  });

  describe("create", () => {
    it("must create new project on /api/projects/:id and return status 200", async () => {
      tracker.on.insert("projects").responseOnce(mockedId);

      const response = await app.request("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockedProjectPayload),
      });

      expect(response.status).toBe(201);
      expect(response.headers.get("Location")).toBe(`/projects/${mockedId}`);
    });
  });

  describe("edit", () => {
    it.each([
      {
        scenario: "project undefined",
        inputId: mockedId,
        dbResponse: 0,
        isSuccess: false,
      },
      {
        scenario: "success",
        inputId: mockedId,
        dbResponse: 1,
        isSuccess: true,
      },
    ])(
      "must return a 204 or 404 status with an error: $scenario",
      async ({ inputId, dbResponse, isSuccess }) => {
        tracker.on.update("projects").responseOnce(dbResponse);

        const response = await app.request(`/api/projects/${inputId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockedProjectPayload),
        });

        if (isSuccess) {
          expect(response.status).toBe(204);
          expect(response.headers.get("Location")).toBe(`/projects/${mockedId}`);
        } else {
          expect(response.status).toBe(404);

          const result = (await response.json()) as AppResponse;
          expect(result).toEqual(APP_ERRORS.NOT_FOUND);
        }
      }
    );
  });

  describe("logout", () => {
    it.each([
      {
        scenario: "project undefined",
        inputId: mockedId,
        dbResponse: 0,
        isSuccess: false,
      },
      {
        scenario: "success",
        inputId: mockedId,
        dbResponse: 1,
        isSuccess: true,
      },
    ])(
      "must return a 204 or 404 status with an error: $scenario",
      async ({ inputId, dbResponse, isSuccess }) => {
        tracker.on.delete("projects").responseOnce(dbResponse);

        const response = await app.request(`/api/projects/${inputId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockedProjectPayload),
        });

        if (isSuccess) {
          expect(response.status).toBe(204);
          expect(response.headers.get("Location")).toBe("/projects");
        } else {
          expect(response.status).toBe(404);

          const result = (await response.json()) as AppResponse;
          expect(result).toEqual(APP_ERRORS.NOT_FOUND);
        }
      }
    );
  });
});
