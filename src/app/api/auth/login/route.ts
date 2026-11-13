import { loginSchema } from "@/lib/schemas/user";
import { createSession } from "@/lib/session";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error" }, { status: 400 });
    }

    const code = parsed.data.code;
    const user = await db.orm.public.User.where({ code }).first();

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid code",
        },
        {
          status: 401,
        },
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(`Login Error: ${err}`);
    return NextResponse.json({ error: "Login not success" }, { status: 500 });
  }
}
