import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import Listing from "@/models/Listing";
import {
  getFilteredListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
} from "@/services/listings/listings";

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
      { success: false, message: "Error connecting to database" },
      { status: 500 }
    );
  }
}

// GET: Return a number of filtered listings stored in db
// input: req for an amount of certain listings
//    (ex: /listings/?labId=3&page=2&limit=5)
// output: 10 possibly filtered listings from the db
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
      },
      { status: 400 }
    );
  }

  try {
    const listing = await Listing.create({
      ...parsedBody.data,
      // could possibly have {timestamps:true in schema to remove date stamp here}
      createdAt: new Date(),
    });
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
