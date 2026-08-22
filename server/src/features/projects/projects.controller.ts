import db from "@/shared/database";
import { ProjectsService } from "./projects.service";
import { AppContext } from "@/shared/utils-types";
import { Id } from "@shared/schemas/Id";
import { Project, ProjectPayload, ProjectsList } from "@shared/schemas/Project";
import { HonoServerResponse } from "@shared/schemas/appResponse";
import { APP_ERRORS, AppError } from "@shared/appError";

export class ProjectsController {
  private readonly projectsService = new ProjectsService(db);

  private getIdParam(c: AppContext): Id {
    const id = c.req.param("id");
    if (!id) throw new AppError(APP_ERRORS.BAD_REQUEST);

    return id;
  }

  public getAll = async (c: AppContext): HonoServerResponse<ProjectsList> => {
    const projects = await this.projectsService.getAll();
    return c.json({ data: projects }, 200);
  };

  public getOne = async (c: AppContext): HonoServerResponse<Project> => {
    const id = this.getIdParam(c);
    const project = await this.projectsService.getOne(id);
    return c.json({ data: project }, 200);
  };

  public create = async (c: AppContext<ProjectPayload>): HonoServerResponse => {
    const data = c.req.valid("json");
    const newProjectId = await this.projectsService.create(data);

    c.header("Location", `/projects/${newProjectId}`);
    return c.body(null, 201);
  };

  public edit = async (c: AppContext<ProjectPayload>): HonoServerResponse => {
    const id = this.getIdParam(c);

    const data = c.req.valid("json");
    await this.projectsService.edit(id, data);

    c.header("Location", `/projects/${id}`);
    return c.body(null, 204);
  };

  public delete = async (c: AppContext<Id>): HonoServerResponse => {
    const id = this.getIdParam(c);
    await this.projectsService.delete(id);

    c.header("Location", "/projects");
    return c.body(null, 204);
  };
}
