import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Logged out" });
  } catch (err) {
    console.error(`Logout error: ${err}`);
    return NextResponse.json(
      { error: "Logout is not success" },
      { status: 500 },
    );
  }
}
