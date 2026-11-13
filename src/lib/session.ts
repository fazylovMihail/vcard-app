import { db } from "@/prisma/db";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";

export async function createSession(userId: number) {
  try {
    const { id: sessionId, expiresAt } = await db.orm.public.Session.create({
      userId,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, JSON.stringify(sessionId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return {
      sessionId,
      expiresAt,
    };
  } catch (err) {
    console.error("Session create error");
    throw err;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session) return null;

    const sesisonId = Number(session.value);
    const returningSession = await db.orm.public.Session.where({
      id: sesisonId,
    })
      .include("user")
      .first();

    if (!returningSession) return null;
    if (returningSession.expiresAt < new Date()) {
      await deleteSession();
      return null;
    }

    return returningSession;
  } catch (err) {
    console.error(`Session get error: ${err}`);
    throw err;
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session) return null;

    const sessionId = Number(session.value);

    if (sessionId) {
      await db.orm.public.Session.where({
        id: sessionId,
      }).delete();
    }

    cookieStore.delete(SESSION_COOKIE);
  } catch (err) {
    console.error(`Session delete error: ${err}`);
    throw err;
  }
}
