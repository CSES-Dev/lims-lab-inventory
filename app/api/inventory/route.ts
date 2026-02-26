import { NextResponse } from "next/server";
import { z } from "zod";
import {
    categoryValues,
    notificationAudienceValues,
    notificationEventValues,
} from "@/models/Item";
import { addItem, getItems } from "@/services/items";
import { connectToDatabase } from "@/lib/mongoose";

// Only returns a Next response upon failed connection
async function connect() {
    try {
        await connectToDatabase();
    } catch {
        return NextResponse.json(
            { success: false, message: "Error connecting to database" },
            { status: 500 }
        );
    }
}

const thresholdSchema = z.object({
    minQuantity: z.number().int().nonnegative(),
    enabled: z.boolean(),
    lastAlertSentAt: z.coerce.date(),
});

const notificationPolicySchema = z.object({
    event: z.enum(notificationEventValues),
    audience: z.enum(notificationAudienceValues),
});

const itemCreateSchema = z.object({
    labId: z.string().min(1),
    name: z.string().min(1),
    category: z.enum(categoryValues),
    quantity: z.number().int().nonnegative(),
    threshold: thresholdSchema,
    notificationPolicy: notificationPolicySchema,
});

// GET: fetch all items
export async function GET() {
    const connectionResponse = await connect();
    if (connectionResponse) {
        return connectionResponse;
    }

    try {
        const items = await getItems();
        return NextResponse.json(items, { status: 200 });
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch items" },
            { status: 500 }
        );
    }
}

// GET FILTERED should go here

// POST: add a new item
export async function POST(request: Request) {
    const connectionResponse = await connect();
    if (connectionResponse) {
        return connectionResponse;
    }

    const body = await request.json();
    const parsedBody = itemCreateSchema.safeParse(body);

    if (!parsedBody.success) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid request body.",
            },
            { status: 400 }
        );
    }

    try {
        const created = await addItem(parsedBody.data);
        return NextResponse.json(created, { status: 201 });
    } catch {
        return NextResponse.json(
            { message: "Error occured while creating item" },
            { status: 500 }
        );
    }
}
