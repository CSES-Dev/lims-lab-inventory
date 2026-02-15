import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Listing from "@/models/Listing";

/* IMPORTANT: implement user auth in future (e.g. only lab admins create/delete) */

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
  const labId = searchParams.get("labId");
  const itemId = searchParams.get("itemId");

  /* FILTERS */
  // build query obj to filter by lab/item id if filters not null
  const query: any = {};
  if (labId) query.labId = labId;
  if (itemId) query.itemId = itemId;

  /* PAGINATION */
  // default to 10 listings per page
  const pageParam = parseInt(searchParams.get("page") || "1");
  const limitParam = parseInt(searchParams.get("limit") || "10");

  // page must be >= 1 if given
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const MAX_LIMIT = 20; // inquire about this in the future
  const limit =
    isNaN(limitParam) || limitParam < 1 ? 10 : Math.min(limitParam, MAX_LIMIT);

  const skip = (page - 1) * limit;

  try {
    const listings = await Listing.find(query).skip(skip).limit(limit);
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
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 }
    );
  }

  try {
    const listing = await Listing.create({ ...body, createdAt: new Date() });
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
