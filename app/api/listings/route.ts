import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import Listing from "@/models/Listing";

const listingValidationSchema = z.object({
  itemId: z.string().min(1),
  labId: z.string().min(1),
  quantityAvailable: z.number().min(1),
  createdAt: z
    .string()
    // could possibly change to MM-DD-YYYY
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD."),
});

// helper method to verify connection
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

// GET: Return all listings stored in DB
// input: get request with no query string for id
async function GET() {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  try {
    const listings = await Listing.find();
    return NextResponse.json(
      { success: true, data: listings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error occurred while retrieving listings." },
      { status: 500 }
    );
  }
}

// POST: Create a new listing in DB
// input: post request with json data in body
async function POST(request: Request) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  // assuming frontend sends req with content-type set to app/json
  // content type automatically set as app/json
  const body = await request.json();
  const parsedBody = listingValidationSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
        // error: parsedBody.error.format(), don't expose error?
      },
      { status: 400 }
    );
  }

  try {
    const listing = await Listing.create(parsedBody.data);
    return NextResponse.json(
      {
        success: true,
        message: "Successfully created new listing.",
        data: listing,
      },
      { status: 201, headers: { Location: `/app/listings/${listing._id}` } }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        // don't send mongo's error - exposes design info
        { success: false, message: "This listing already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error occurred while creating new listing." },
      { status: 500 }
    );
  }
}

export { GET, POST };
