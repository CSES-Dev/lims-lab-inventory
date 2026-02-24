// /app/api/lab/route.ts

/**
 * API Route for Lab Management
 * This file defines the API routes for managing lab entries in the inventory 
 * system. It includes handlers for fetching all labs and creating new lab 
 * entries.
 */

'use server'

import { NextResponse } from "next/server";
import { getLabs, addLab } from "@/services/labs";

// Implement pagination later on (if necessary)
// const PAGE_SIZE = 10;

/**
 * Fetch all lab entries
 * @param request request object
 * @return response with lab data
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    /*
    For later use in pagination:
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    */
    try {
        // Fetch all lab entries from the database and return them in the response
        const labs = await getLabs();
        return NextResponse.json(labs, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * Create a new lab entry
 * @param request request object
 * @return response after creating new lab entry
 */
export async function POST(request: Request) {
    try {
        // Connect to the database and create a new lab entry with the request body
        const newLab = await addLab(await request.json());
        return NextResponse.json(newLab, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}