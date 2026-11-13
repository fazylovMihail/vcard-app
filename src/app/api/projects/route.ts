import { createProjectSchema } from "@/features/projects/schemas";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET() {
  try {
    const users = await db.orm.public.Project.all();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error(`Error GET all project: ${err}`);
    return NextResponse.json(
      { error: "Project list GET not success" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const project = await db.orm.public.Project.create(parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(`Error POST project: ${err}`);
    return NextResponse.json(
      { error: "Project POST not success" },
      { status: 500 },
    );
  }
}
