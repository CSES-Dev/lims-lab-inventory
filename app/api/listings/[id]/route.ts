import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { z } from "zod";
import {
  deleteListing,
  getListing,
  updateListing,
} from "@/services/listings/listings";
import { ListingInput } from "@/models/Listing";
import { uploadImage } from "@/lib/googleCloud";

/* IMPORTANT: implement user auth in future (e.g. only lab admins create/delete) */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
const listingValidationSchema = z.object({
  // handle defaults here for the optional fields
  itemName: z.string(),
  itemId: z.string(),
  labName: z.string().optional().default(""),
  labLocation: z.string().optional().default(""),
  labId: z.string(),
  imageUrls: z.array(z.string()).optional().default([]),
  quantityAvailable: z.number(),
  expiryDate: z.date().optional(),
  description: z.string().optional().default(""),
  price: z.number().optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  condition: z.enum(["New", "Good", "Fair", "Poor"]),
  hazardTags: z
    .array(z.enum(["Physical", "Chemical", "Biological", "Other"]))
    .optional()
    .default([]),
});

/**
 * Get a listing entry by ID
 * @param id the ID of the listing to get
 * ex req: GET /listings/001 HTTP/1.1
 * @returns the listing as a JS object in a JSON response
 */
async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, message: "Error connecting to database." },
      { status: 500 }
    );
  }

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
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, message: "Error connecting to database." },
      { status: 500 }
    );
  }

  const parsedId = objectIdSchema.safeParse(params.id);
  if (!parsedId.success) {
    console.log(
      "PUT - Validation error:",
      JSON.stringify(parsedId.error?.issues, null, 2)
    );
    return NextResponse.json(
      {
        success: false,
        message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
      },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const entries = Array.from(formData.entries());

  // separate image and hazardTags from other fields
  const textEntries: [string, FormDataEntryValue][] = [];
  const hazardTags: string[] = [];

  for (const [key, value] of entries) {
    if (key === "images") continue;
    if (key === "hazardTags") {
      hazardTags.push(value as string);
    } else {
      textEntries.push([key, value]);
    }
  }

  // create plain JS object
  const result = Object.fromEntries(textEntries) as Partial<ListingInput>;
  result.hazardTags = hazardTags as typeof result.hazardTags;

  // convert types (since formData changed to string)
  if (result.quantityAvailable) {
    result.quantityAvailable = Number(result.quantityAvailable);
  }
  if (result.price) {
    result.price = Number(result.price);
  }
  if (result.expiryDate) {
    result.expiryDate = new Date(result.expiryDate as unknown as string);
  }

  // handle new image uploads
  const imageFiles = formData.getAll("images") as File[];
  const existingImageUrls = formData.get("existingImageUrls");

  let allImageUrls: string[] = [];

  // parse existing image URLs if provided
  if (existingImageUrls) {
    try {
      allImageUrls = JSON.parse(existingImageUrls as string);
    } catch {
      // invalid JSON
      allImageUrls = [];
    }
  }

  // upload new images and add to array
  for (const imageFile of imageFiles) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUrl = await uploadImage(buffer, imageFile.name);
    allImageUrls.push(imageUrl);
  }
  result.imageUrls = allImageUrls;

  const validator = z.object({
    id: objectIdSchema,
    update: listingValidationSchema.partial(),
  });

  const parsedRequest = validator.safeParse({
    id: parsedId.data,
    update: result,
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
    const updatedListing = await updateListing(
      parsedId.data,
      parsedRequest.data.update
    );
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
  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { success: false, message: "Error connecting to database." },
      { status: 500 }
    );
  }

  const parsedId = objectIdSchema.safeParse(params.id);
  console.log("DELETE - Parsed ID:", parsedId);
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
      { status: 200 }
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
