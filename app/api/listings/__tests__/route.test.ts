import mongoose from "mongoose";
import { GET, POST } from "@/app/api/listings/route";
import { GET as GET_BY_ID, PUT, DELETE } from "@/app/api/listings/[id]/route";
import { connectToDatabase } from "@/lib/mongoose";

/** test route handler, mock db connection and svc handlers */
jest.mock("@/lib/mongoose", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/services/listings/listings", () => ({
  getListings: jest.fn(),
  getFilteredListings: jest.fn(),
  getListing: jest.fn(),
  addListing: jest.fn(),
  updateListing: jest.fn(),
  deleteListing: jest.fn(),
}));

jest.mock("@/lib/googleCloud", () => ({
  uploadImage: jest.fn().mockResolvedValue("https://mock.com/image.jpg"),
}));

/** import after mocking */
import {
  getListings,
  getFilteredListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
} from "@/services/listings/listings";

describe("API: Successful Responses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /listings", () => {
    test("returns filtered listings successfully", async () => {
      // arrange
      const date = new Date().toISOString();
      const id = "123";

      const listingData = {
        id: id,
        itemName: "Flask",
        itemId: "item1",
        labName: "Dr. Jones Lab",
        labLocation: "Torrey Pines",
        labId: "lab1",
        imageUrls: [],
        quantityAvailable: 5,
        createdAt: date,
        expiryDate: null,
        description: "High quality flask for use",
        price: 50,
        status: "ACTIVE",
        condition: "New",
        hazardTags: ["Physical"],
      };

      (connectToDatabase as jest.Mock).mockResolvedValue({});
      (getFilteredListings as jest.Mock).mockResolvedValue({
        listings: [listingData],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      // act
      const req = new Request("http://localhost/api/listings");
      const res = await GET(req);
      const body = await res.json();

      // assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual([listingData]);
      expect(body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(getFilteredListings).toHaveBeenCalledWith({
        labId: undefined,
        itemId: undefined,
        page: 1, // default
        limit: 10, // default
      });
    });
  });

  describe("GET /listings/[id]", () => {
    test("returns a specific listing successfully", async () => {
      const date = new Date().toISOString();
      const id = new mongoose.Types.ObjectId().toString();

      const listingData = {
        id: id,
        itemName: "Flask",
        itemId: "item1",
        labName: "Dr. Jones Lab",
        labLocation: "Torrey Pines",
        labId: "lab1",
        imageUrls: [],
        quantityAvailable: 5,
        createdAt: date,
        expiryDate: null,
        description: "High quality flask for use",
        price: 50,
        status: "ACTIVE",
        condition: "New",
        hazardTags: ["Physical"],
      };

      (connectToDatabase as jest.Mock).mockResolvedValue({});
      (getListing as jest.Mock).mockResolvedValue(listingData);

      const req = new Request(`http://localhost/api/listings/${id}`);
      const res = await GET_BY_ID(req, { params: { id: id } });
      const body = await res.json();

      expect(res.status).toEqual(200);
      expect(body.success).toEqual(true);
      expect(body.data).toEqual(listingData);
    });
  });

  describe("POST /listings", () => {
    test("creates a new listing successfully", async () => {});
  });

  describe("PUT /listings/[id]", () => {
    test("updates a listing successfully", async () => {});
  });

  describe("DELETE /listings/[id]", () => {
    test("deletes a listing successfully", async () => {});
  });
});

describe("API: Error Responses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /listings", () => {
    test("DB connection error", async () => {
      (connectToDatabase as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const req = new Request("http://localhost/api/listings");
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual("Error connecting to database.");
    });

    test("service error retrieving listings", async () => {
      (connectToDatabase as jest.Mock).mockResolvedValue({});
      (getFilteredListings as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      const req = new Request("http://localhost/api/listings");
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual("Error occurred while retrieving listings.");
      expect(getFilteredListings).toHaveBeenCalledWith({
        labId: undefined,
        itemId: undefined,
        page: 1,
        limit: 10,
      });
    });
  });

  describe("GET /listings/[id]", () => {
    test("DB connection error", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      (connectToDatabase as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const req = new Request(`http://localhost/api/listings/${id}`);
      const res = await GET_BY_ID(req, { params: { id: id } });
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual("Error connecting to database.");
    });

    test("invalid id format", async () => {
      const id = "123";

      (connectToDatabase as jest.Mock).mockResolvedValue({});

      const req = new Request(`http://localhost/api/listings/${id}`);
      const res = await GET_BY_ID(req, { params: { id: id } });
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual(
        "Invalid ID format. Must be a valid MongoDB ObjectId."
      );
    });

    test("listing not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      (connectToDatabase as jest.Mock).mockResolvedValue({});
      (getListing as jest.Mock).mockResolvedValue(null);

      const req = new Request(`http://localhost/api/listings/${id}`);
      const res = await GET_BY_ID(req, { params: { id: id } });
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual("Listing not found.");
      expect(getListing).toHaveBeenCalledWith(id);
    });

    test("service error retrieving listing", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      (connectToDatabase as jest.Mock).mockResolvedValue({});
      (getListing as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const req = new Request(`http://localhost/api/listings/${id}`);
      const res = await GET_BY_ID(req, { params: { id: id } });
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.success).toEqual(false);
      expect(body.message).toEqual("Error occurred while retrieving listing.");
      expect(getListing).toHaveBeenCalledWith(id);
    });
  });

  describe("POST /listings", () => {
    test("DB connection error", async () => {});
    test("invalid req body", async () => {});
    test("listing already exists", async () => {});
    test("service error creating listing", async () => {});
  });

  describe("PUT /listings/[id]", () => {
    test("DB connection error", async () => {});
    test("invalid id format", async () => {});
    test("invalid req body", async () => {});
    test("listing not found", async () => {});
    test("service error updating listing", async () => {});
  });

  describe("DELETE /listings/[id]", () => {
    test("DB connection error", async () => {});
    test("invalid id format", async () => {});
    test("listing not found", async () => {});
    test("service error deleting listing", async () => {});
  });
});
