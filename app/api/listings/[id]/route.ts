import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

/* IMPORTANT: implement user auth in future (e.g. only lab admins create/delete) */
const listingValidationSchema = z.object({
  itemId: z.string().min(1),
  labId: z.string().min(1),
  quantityAvailable: z.number().min(1),
});

// helper method to verify connection
async function connect() {
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, message: "Error connecting to database." },
      { status: 500 }
    );
  }
}

// GET: Return a single listing in the db
// input: req for specific listing with given id
//    (ex: /listings/001)
// output: json response with the listing as a JS object if found
async function GET(request: Request) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
      },
      { status: 400 }
    );
  }

  try {
    const listing = await Listing.findById(id).lean(); // don't need mongo doc features
    if (!listing) {
      return NextResponse.json(
        { success: false, message: "Listing not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: listing }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error occurred while retrieving listing." },
      { status: 500 }
    );
  }
}

async function PUT(request: Request) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;
}

async function DELETE(request: Request) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;
}

export { GET, PUT, DELETE };
