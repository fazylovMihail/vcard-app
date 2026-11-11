import { idSchema } from "@/lib/schemas/id";
import { updateProjectSchema } from "@/features/projects/schemas";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import z from "zod";

type RouteContext = {
  params: Promise<{ id: number }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    await db.orm.public.Project.where({ id }).update(parsed.data);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(`Error PATCH project: ${err}`);
    return NextResponse.json(
      { error: "Project PATCH not success" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await db.orm.public.Project.where({ id }).delete();

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(`Error DELETE project: ${err}`);
    return NextResponse.json(
      { error: "Project DELETE not success" },
      { status: 500 },
    );
  }
}
