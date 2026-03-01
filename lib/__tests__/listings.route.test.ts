import { GET, POST } from "@/app/api/listings/route";
import { getFilteredListings } from "@/services/listings/listings";
import { mock } from "node:test";

jest.mock("@/services/listings/listings", () => ({
  getFilteredListings: jest.fn(),
}));

describe("GET Request Filter Tests", () => {
  // make sure tests are independent
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("successfully returns all listings with status 200", async () => {
    // arrange
    const mockListings = [
      {
        id: "123",
        itemId: "item1",
        labId: "3",
        quantityAvailable: 10,
        status: "ACTIVE",
        createdAt: new Date(),
      },
      {
        id: "456",
        itemId: "item2",
        labId: "3",
        quantityAvailable: 5,
        status: "ACTIVE",
        createdAt: new Date(),
      },
    ];
    const mockPagination = {
      page: 2,
      limit: 5,
      total: 5,
      totalPages: 1,
    };
    const mockResult = {
      success: true,
      data: mockListings,
      pagination: mockPagination,
    };

    (getFilteredListings as jest.Mock).mockResolvedValue({
      listings: mockListings,
      pagination: mockPagination,
    });

    const mockRequest = new Request("/listings?labId=3&page=2&limit=5", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // act
    const response = await GET(mockRequest);
    const responseBody = await response.json();

    // assert
    expect(responseBody).toHaveProperty("success", true);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody).toHaveProperty("pagination");
    expect(responseBody.data).toEqual(mockListings);
    expect(responseBody.pagination.page).toEqual(2);
    expect(responseBody.pagination.limit).toEqual(5);
    expect(responseBody.pagination.total).toEqual(5);
    expect(responseBody.pagination.totalPages).toEqual(1);
    expect(responseBody).toEqual(mockResult);

    // Verify getFilteredListings was called correctly
    expect(getFilteredListings).toHaveBeenCalledWith({
      labId: "3",
      itemId: undefined,
      page: 2,
      limit: 5,
    });
  });
});

describe("POST Request Tests", () => {
  // make sure tests are independent
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("creates a new listing successfully", async () => {
    const listingData = {};
    const response = {};
  });

  test("handles API error during incomplete listing creation", async () => {
    // arrange
    const mockResult = {
      success: false,
      message: "Invalid request body.",
    };
    const mockPostData = JSON.stringify({ labId: 1 }); // data incomplete
    const mockRequest = new Request("/listings", {
      method: "POST",
      body: mockPostData,
      headers: { "Content-Type": "application/json" },
    });

    // act
    const response = await POST(mockRequest);
    const responseBody = await response.json();

    // assert
    expect(response.status).toBe(400);
    expect(responseBody).toEqual(mockResult);
  });
});
