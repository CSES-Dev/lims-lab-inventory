import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import {
  deleteListing,
  getListing,
  updateListing,
} from "@/services/listings/listings";

/* IMPORTANT: implement user auth in future (e.g. only lab admins create/delete) */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
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
      { success: false, message: "Error connecting to database." },
      { status: 500 }
    );
  }
}

/**
 * Get a listing entry by ID
 * @param id the ID of the listing to get
 * ex req: GET /listings/001 HTTP/1.1
 * @returns the listing as a JS object in a JSON response
 */
async function GET(request: Request, { params }: { params: { id: string } }) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  const parsedId = objectIdSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
      },
      { status: 400 }
    );
  }

  try {
    const listing = await getListing(parsedId.data); // don't need mongo doc features
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

/**
 * Update a listing entry by ID
 * @param id the ID of the listing to get as part of the path params
 * @returns the updated listing as a JS object in a JSON response
 */
async function PUT(request: Request, { params }: { params: { id: string } }) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  const parsedId = objectIdSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
      },
      { status: 400 }
    );
  }

  const body = await request.json();

  const validator = z.object({
    id: objectIdSchema,
    update: listingValidationSchema.partial(),
  });

  const parsedRequest = validator.safeParse({
    id: parsedId.data,
    update: body,
  });
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 }
    );
  }

  try {
    const updatedListing = await updateListing(parsedId.data, body);
    if (!updatedListing) {
      return NextResponse.json(
        {
          success: false,
          message: "Listing not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: updatedListing,
        message: "Listing successfully updated.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while updating listing.",
      },
      { status: 500 }
    );
  }
}

/**
 * Delete a listing entry by ID
 * @param id the ID of the listing to get as part of the path params
 * @returns JSON response signaling the success of the listing deletion
 */
async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connectionResponse = await connect();
  if (connectionResponse) return connectionResponse;

  const parsedId = objectIdSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
      },
      { status: 400 }
    );
  }

  try {
    const listing = await deleteListing(parsedId.data);
    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          message: "Listing not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Listing successfully deleted.",
      },
      { status: 204 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while deleting listing.",
      },
      { status: 500 }
    );
  }
}

export { GET, PUT, DELETE };
