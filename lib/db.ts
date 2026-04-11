// Outdated

import { connectToDatabase } from "./mongoose";
import { NextResponse } from "next/server";

export async function connect() {
    try {
        console.log(process.env.DATABASE_URL);
        await connectToDatabase();
    } catch {
        return NextResponse.json(
            { success: false, message: "Error connecting to database" },
            { status: 500 }
        );
    }
}
