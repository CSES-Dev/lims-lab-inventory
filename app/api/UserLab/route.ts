import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getUserLabs,
  getUserLab,
  addUserLab,
  updateUserLab,
  deleteUserLab,
} from "@/services/userLab";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const userLabBaseSchema = z.object({
  user: objectIdSchema,
  lab: objectIdSchema,
  role: z.enum(["member", "lead", "admin"]).optional(),
});

const userLabUpdateSchema = userLabBaseSchema.partial();


// GET: all or by id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json(
        { message: "Invalid id" },
        { status: 400 }
      );
    }

    const entry = await getUserLab(parsedId.data);
    if (!entry) {
      return NextResponse.json(
        { message: "UserLab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(entry, { status: 200 });
  } else {
    const entries = await getUserLabs();
    return NextResponse.json(entries, { status: 200 });
  }
}


// POST
export async function POST(request: Request) {
  const body = userLabBaseSchema.parse(await request.json());

  const created = await addUserLab({
    user: body.user,
    lab: body.lab,
    role: body.role || "member",
  });

  return NextResponse.json(created, { status: 201 });
}


// PUT
export async function PUT(request: Request) {
  const validator = z.object({
    id: objectIdSchema,
    update: userLabUpdateSchema,
  });

  const parsed = validator.parse(await request.json());

  const updated = await updateUserLab(parsed.id, parsed.update);

  if (!updated) {
    return NextResponse.json(
      { message: "UserLab not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated, { status: 200 });
}


// DELETE
export async function DELETE(request: Request) {
  const validator = z.object({ id: objectIdSchema });

  const { id } = validator.parse(await request.json());

  const deleted = await deleteUserLab(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "UserLab not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "UserLab deleted" },
    { status: 200 }
  );
}
