import { NextResponse } from "next/server";
import { z } from "zod";
import { getItem, updateItem, deleteItem } from "@/services/items";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// GET: fetch single item by id
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const parsedId = objectIdSchema.safeParse(params.id);
    if (!parsedId.success) {
        return NextResponse.json(
            { message: parsedId.error.issues[0]?.message ?? "Invalid id" },
            { status: 400 }
        );
    }

    const item = await getItem(parsedId.data);
    if (!item) {
        return NextResponse.json(
            { message: "Item not found" },
            { status: 404 }
        );
    }
    return NextResponse.json(item, { status: 202 });
}

// PUT: update an item by id
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const parsedId = objectIdSchema.safeParse(params.id);
    if (!parsedId.success) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const updateData = await request.json();

    const updated = await updateItem(parsedId.data, updateData);
    if (!updated) {
        return NextResponse.json(
            { message: "Item not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated, { status: 200 });
}

// DELETE: Delete a product by id
export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    const parsedId = objectIdSchema.safeParse(params.id);
    if (!parsedId.success) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const deleted = await deleteItem(params.id);
    if (!deleted) {
        return NextResponse.json(
            { message: "Item not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(deleted, { status: 200 });
}
