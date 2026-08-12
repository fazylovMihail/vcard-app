import { Login, LoginSchema } from "@/shared/utils/models";
import { AppError, APP_ERRORS } from "@shared/models/AppError";
import { CreateSession, ReturningSession } from "@shared/models/Sesssion";
import { User, UserLogin } from "@shared/models/User";
import { Id } from "@shared/models/utils";
import { compare } from "bcrypt";
import { Knex } from "knex";
import { nanoid } from "nanoid";

export class AuthService {
  private readonly db: Knex;
  private readonly DUMMY_HASH =
    "111111111111111111111111111111111111111111111111111111111111";

  constructor(dbInstance: Knex) {
    this.db = dbInstance;
  }

  private async createSession(userId: Id): Promise<Id> {
    const rawSession: CreateSession = {
      session_id: nanoid(),
      user_id: userId,
    };

    const result = await this.db("sessions")
      .insert(rawSession)
      .returning<ReturningSession[] | undefined>("session_id");

    if (!result) throw new AppError(APP_ERRORS.INTERNAL_SERVER);

    return result[0].session_id;
  }

  public async login({ username, password }: UserLogin): Promise<Login> {
    const user = await this.db
      .select()
      .table("users")
      .where({ username })
      .first<User | undefined>();

    const hashToCompare = user ? user.password : this.DUMMY_HASH;
    const isPasswordCorrect = await compare(password, hashToCompare);

    if (!isPasswordCorrect || !user) throw new AppError(APP_ERRORS.AUTH_FAILED);

    const sessionId = await this.createSession(user.id);
    const result = LoginSchema.parse({
      sessionId,
      user: {
        id: user.id,
        username: user.username,
      },
    });

    return result;
  }

  public async logout(session: ReturningSession): Promise<void> {
    const deletedCount = await this.db
      .table("sessions")
      .where({ session_id: session.session_id })
      .delete();

    if (deletedCount === 0) throw new AppError(APP_ERRORS.SESSION_EXPIRED);
  }
}
