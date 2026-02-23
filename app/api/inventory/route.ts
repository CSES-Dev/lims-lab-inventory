import { NextResponse } from "next/server";
import { z } from "zod";
import {
    categoryValues,
    notificationAudienceValues,
    notificationEventValues,
} from "@/models/Item";
import { addItem, getItems } from "@/services/items";

// REST APIs split among route.ts and [id]/route.ts for cleaner management

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
// implement page, limit, labid search params
export async function GET() {
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

// POST: add a new item
export async function POST(request: Request) {
    try {
        const newItem = itemCreateSchema.parse(await request.json());
        const created = await addItem(newItem);
        return NextResponse.json(created, { status: 201 });
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
