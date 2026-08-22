import { Id, IdSchema } from "@shared/schemas/Id";
import { User, UserLogin, UserSchema } from "@shared/schemas/User";
import { SessionCreate, SessionId } from "@shared/schemas/Session";
import { compare } from "bcrypt";
import { Knex } from "knex";
import { nanoid } from "nanoid";
import { APP_ERRORS, AppError } from "@shared/appError";
import z from "zod";

export const LoginSchema = z.object({
  sessionId: IdSchema,
  username: UserSchema.shape.username,
});

export type Login = z.infer<typeof LoginSchema>;

export class AuthService {
  private readonly db: Knex;
  // Dummy hash to prevent timing attacks.
  // Used if a user with the specified username is not found in the database.
  private readonly DUMMY_HASH =
    "111111111111111111111111111111111111111111111111111111111111"; // hash for undefined user

  constructor(dbInstance: Knex) {
    this.db = dbInstance;
  }

  private async createSession(userId: Id): Promise<Id> {
    const rawSession: SessionCreate = {
      session_id: nanoid(),
      user_id: userId,
    };

    const result = await this.db("sessions")
      .insert(rawSession)
      .returning<SessionId[] | undefined>("session_id");

    if (!result || result.length === 0) throw new AppError(APP_ERRORS.DATABASE_FAILED);

    return result[0].session_id;
  }

  async login({ username, password }: UserLogin): Promise<Login> {
    const user = (await this.db.select().table("users").where({ username }).first()) as
      User | undefined;

    const hashToCompare = user ? user.password : this.DUMMY_HASH;
    const isPasswordCompare = await compare(password, hashToCompare);

    if (!isPasswordCompare || !user) throw new AppError(APP_ERRORS.AUTH_FAILED);

    const sessionId = await this.createSession(user.id);

    const result = LoginSchema.parse({ sessionId, username: user.username });

    return result;
  }

  async logout(sessionId: Id): Promise<void> {
    const deletedCount = await this.db("sessions")
      .where({ session_id: sessionId })
      .delete();
    if (deletedCount === 0) throw new AppError(APP_ERRORS.SESSION_EXPIRED);
  }
}
