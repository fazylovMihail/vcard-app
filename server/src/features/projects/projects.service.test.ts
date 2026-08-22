import knex from "knex";
import { createTracker, MockClient, Tracker } from "knex-mock-client";
import { ProjectsService } from "./projects.service";
import { APP_ERRORS, AppError } from "@shared/appError";

describe("ProjectsService", () => {
  let tracker: Tracker;
  let projectsService: ProjectsService;

  const mockedId = "111111111111111111111";
  const mockedProjectPayload = {
    title: "project",
    content: "project content",
    real_created_at: new Date(),
    gh_url: "https://github.com",
    deploy_url: "https://deploy.com",
  };
  const mockedProject = {
    id: mockedId,
    ...mockedProjectPayload,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    const mockedDb = knex({ client: MockClient });

    tracker = createTracker(mockedDb);
    projectsService = new ProjectsService(mockedDb);
  });

  describe("getAll", () => {
    it("must return a list", async () => {
      const dbResponse = [mockedProject];
      tracker.on.select("projects").responseOnce(dbResponse);

      const projects = await projectsService.getAll();

      expect(projects).toEqual(dbResponse);
    });
  });

  describe("getOne", () => {
    it.each([
      {
        scenario: "success",
        inputId: mockedId,
        dbResponse: mockedProject,
        isSuccess: true,
      },
      {
        scenario: "project undefined",
        inputId: mockedId,
        dbResponse: undefined,
        isSuccess: false,
      },
    ])(
      "must work through the scenario: $scenario",
      async ({ inputId, dbResponse, isSuccess }) => {
        tracker.on.select("projects").responseOnce(dbResponse);

        const resultPromise = projectsService.getOne(inputId);

        if (isSuccess) {
          const project = await resultPromise;
          expect(project).toEqual(dbResponse);
        } else {
          await expect(resultPromise).rejects.toThrow(new AppError(APP_ERRORS.NOT_FOUND));
        }
      }
    );
  });

  describe("create", () => {
    it("must create a new project and return id", async () => {
      tracker.on.insert("projects").responseOnce(mockedId);

      const projectId = await projectsService.create(mockedProjectPayload);

      expect(projectId).toBe(mockedId);
    });

    it("must return database error", async () => {
      const mockedError = new AppError(APP_ERRORS.DATABASE_FAILED);
      tracker.on.insert("projects").simulateErrorOnce(mockedError);

      const resultPromise = projectsService.create(mockedProjectPayload);

      await expect(resultPromise).rejects.toThrow(mockedError);
    });
  });

  describe("edit", () => {
    it("must update project and nothing return", async () => {
      tracker.on.update("projects").responseOnce(1);

      const resultPromise = projectsService.edit(mockedId, mockedProjectPayload);

      await expect(resultPromise).resolves.toBeUndefined();
    });

    it("must return an error if the project is not found", async () => {
      const mockedError = new AppError(APP_ERRORS.NOT_FOUND);
      tracker.on.update("projects").simulateErrorOnce(mockedError);

      const resultPromise = projectsService.edit(mockedId, mockedProjectPayload);

      await expect(resultPromise).rejects.toThrow(mockedError);
    });
  });

  describe("delete", () => {
    it("must delete project and nothing return", async () => {
      tracker.on.delete("projects").responseOnce(1);

      const resultPromise = projectsService.delete(mockedId);

      await expect(resultPromise).resolves.toBeUndefined();
    });

    it("must return an error if the project is not found", async () => {
      const mockedError = new AppError(APP_ERRORS.NOT_FOUND);

      tracker.on.delete("projects").simulateErrorOnce(mockedError);

      const resultPromise = projectsService.delete(mockedId);

      await expect(resultPromise).rejects.toThrow(mockedError);
    });
  });
});
