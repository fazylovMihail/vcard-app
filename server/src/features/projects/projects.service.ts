import { APP_ERRORS, AppError } from "@shared/appError";
import { Id, IdSchema } from "@shared/schemas/Id";
import {
  Project,
  ProjectPayload,
  ProjectSchema,
  ProjectsList,
  ProjectsListSchema,
} from "@shared/schemas/Project";
import { User } from "@shared/schemas/User";
import { Knex } from "knex";
import { nanoid } from "nanoid";

export class ProjectsService {
  private readonly db: Knex;

  constructor(dbInstance: Knex) {
    this.db = dbInstance;
  }

  public async getAll(): Promise<ProjectsList> {
    const projects =
      (await this.db.select<ProjectsList | undefined>().table("projects")) ?? [];

    const result = ProjectsListSchema.parse(projects);

    return result;
  }

  public async getOne(id: Id): Promise<Project> {
    const project = await this.db
      .select()
      .table("projects")
      .where({ id })
      .first<Project | undefined>();
    if (!project) throw new AppError(APP_ERRORS.NOT_FOUND);

    const result = ProjectSchema.parse(project);

    return result;
  }

  public async create(data: ProjectPayload): Promise<Id> {
    const rawProject = {
      id: nanoid(),
      ...data,
    };

    const projectId = await this.db("projects")
      .insert(rawProject)
      .returning<Pick<User, "id">[] | undefined>("id");

    if (!projectId) throw new AppError(APP_ERRORS.DATABASE_FAILED);
    const result = IdSchema.parse(projectId[0].id);

    return result;
  }

  public async edit(id: Id, payload: ProjectPayload): Promise<void> {
    const updatedCount = await this.db("projects").where({ id }).update(payload);
    if (updatedCount === 0) throw new AppError(APP_ERRORS.NOT_FOUND);
  }

  public async delete(id: Id): Promise<void> {
    const deletedCount = await this.db("projects").where({ id }).delete();
    if (deletedCount === 0) throw new AppError(APP_ERRORS.NOT_FOUND);
  }
}
