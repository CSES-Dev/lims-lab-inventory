import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import { getFilteredListings, addListing } from "@/services/listings/listings";

/* IMPORTANT: implement user auth in future (e.g. only lab admins create/delete) */
const listingValidationSchema = z.object({
  itemId: z.string().min(1),
  labId: z.string().min(1),
  quantityAvailable: z.number().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

/**
 * helper method to verify connection
 */
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

/**
 * Get filtered listings stored in db
 * @param request the request
 * ex req: GET /listings/?labId=3&page=2&limit=5 HTTP/1.1
 * @returns JSON response with the filtered listings as JS objects
 */
async function GET(request: Request) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  const { searchParams } = new URL(request.url);
  const labId = searchParams.get("labId") || undefined;
  const itemId = searchParams.get("itemId") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const { listings, pagination } = await getFilteredListings({
      labId,
      itemId,
      page,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: listings,
        pagination,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Error occurred while retrieving listings." },
      { status: 500 }
    );
  }
}

/**
 * Create a new listing to store in db
 * @param request the request with JSON data in req body
 * @returns JSON response with success message and req body echoed
 */
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
      },
      { status: 400 }
    );
  }

  try {
    const listingData = { ...parsedBody.data, createdAt: new Date() };
    const listing = await addListing(listingData);
    return NextResponse.json(
      {
        success: true,
        message: "Successfully created new listing.",
        data: listing,
      },
      { status: 201, headers: { Location: `/app/listings/${listing.id}` } }
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
