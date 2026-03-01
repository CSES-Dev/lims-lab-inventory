import type { HydratedDocument } from "mongoose";
import ListingModel, { Listing, ListingInput } from "@/models/Listing";

type ListingDocument = HydratedDocument<ListingInput>;
const toListing = (doc: ListingDocument): Listing => doc.toObject<Listing>();

interface FilterParams {
  labId?: string;
  itemId?: string;
  page: number;
  limit: number;
}

/**
 * Get all listing entries (likely unused since filtered & paginated more realistic)
 * @returns array of listings as JS objects
 */
async function getListings(): Promise<Listing[]> {
  const listings = await ListingModel.find().exec();
  return listings.map((listing) => toListing(listing));
}

/**
 * Get filtered listing entries
 * @returns array of listings as JS objects
 */
async function getFilteredListings({
  labId,
  itemId,
  page,
  limit,
}: FilterParams) {
  const query: any = {};
  if (labId) query.labId = labId;
  if (itemId) query.itemId = itemId;

  const MAX_LIMIT = 20; // inquire about this in the future
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validLimit =
    isNaN(limit) || limit < 1 ? 10 : Math.min(limit, MAX_LIMIT);
  const skip = (page - 1) * validLimit;

  const [listings, total] = await Promise.all([
    ListingModel.find(query)
      .sort({ createdAt: -1 }) // Sort from newest to oldest
      .skip(skip)
      .limit(validLimit)
      .exec(), // toListing handles doc to JS object, so lean unncessary
    ListingModel.countDocuments(query),
  ]);

  return {
    listings: listings.map((listing) => toListing(listing)),
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
    },
  };
}

/**
 * Get a listing entry by ID
 * @param id the ID of the listing to get
 * @returns the listing as a JS object
 */
async function getListing(id: string): Promise<Listing | null> {
  const listing = await ListingModel.findById(id).exec();
  return listing ? toListing(listing) : null;
}

/**
 * Add new listing entry
 * @param newListing the listing data to add
 * @returns the created listing as JS object
 */
async function addListing(newListing: ListingInput): Promise<Listing> {
  const createdListing = await ListingModel.create(newListing);
  return toListing(createdListing);
}

/**
 * Update listing entry by ID
 * @param id the ID of the listing to update
 * @param data the data passed in to partially or fully update the listing
 * @returns the updated listing or null if not found
 */
async function updateListing(
  id: string,
  data: Partial<ListingInput>
): Promise<Listing | null> {
  const updatedListing = await ListingModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
  return updatedListing ? toListing(updatedListing) : null;
}

/**
 * Delete a listing entry by ID
 * @param id the ID of the listing to delete
 * @returns true if the listing was deleted, false otherwise
 */
// DON'T use this for tables that you don't actually need to potentially delete things from
// Could be used accidentally or misused maliciously to get rid of important data
async function deleteListing(id: string): Promise<boolean> {
  const deleted = await ListingModel.findByIdAndDelete(id).exec();
  return Boolean(deleted);
}

export {
  getFilteredListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
};
