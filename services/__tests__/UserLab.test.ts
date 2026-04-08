import {
  addUserLab,
  deleteUserLab,
  getUserLab,
  getUserLabs,
  updateUserLab,
} from "@/services/UserLab";
import { connectToDatabase } from "@/lib/mongoose";
import UserLab from "@/models/UserLab";

jest.mock("@/lib/mongoose", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/models/UserLab", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockedConnectToDatabase = jest.mocked(connectToDatabase);
const mockedUserLabModel = jest.mocked(UserLab);

describe("UserLab service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConnectToDatabase.mockResolvedValue({} as never);
  });

  it("returns paginated user labs", async () => {
    const populatedWithLab = Promise.resolve([{ _id: "1" }, { _id: "2" }]);
    const populateLab = jest.fn().mockReturnValue(populatedWithLab);
    const populateUser = jest.fn().mockReturnValue({ populate: populateLab });
    const limit = jest.fn().mockReturnValue({ populate: populateUser });
    const skip = jest.fn().mockReturnValue({ limit });

    mockedUserLabModel.find.mockReturnValue({ skip } as never);
    mockedUserLabModel.countDocuments.mockResolvedValue(12 as never);

    const result = await getUserLabs({ page: 2, limit: 5 });

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(mockedUserLabModel.find).toHaveBeenCalledTimes(1);
    expect(skip).toHaveBeenCalledWith(5);
    expect(limit).toHaveBeenCalledWith(5);
    expect(populateUser).toHaveBeenCalledWith("user");
    expect(populateLab).toHaveBeenCalledWith("lab");
    expect(mockedUserLabModel.countDocuments).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      items: [{ _id: "1" }, { _id: "2" }],
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
    });
  });

  it("returns one page when total is zero", async () => {
    const populatedWithLab = Promise.resolve([]);
    const populateLab = jest.fn().mockReturnValue(populatedWithLab);
    const populateUser = jest.fn().mockReturnValue({ populate: populateLab });
    const limit = jest.fn().mockReturnValue({ populate: populateUser });
    const skip = jest.fn().mockReturnValue({ limit });

    mockedUserLabModel.find.mockReturnValue({ skip } as never);
    mockedUserLabModel.countDocuments.mockResolvedValue(0 as never);

    const result = await getUserLabs({ page: 1, limit: 10 });

    expect(result).toEqual({
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });
  });

  it("gets one user lab by id", async () => {
    const populatedWithLab = Promise.resolve({ _id: "1" });
    const populateUser = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue(populatedWithLab),
    });

    mockedUserLabModel.findById.mockReturnValue({ populate: populateUser } as never);

    const result = await getUserLab("abc123");

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(mockedUserLabModel.findById).toHaveBeenCalledWith("abc123");
    expect(populateUser).toHaveBeenCalledWith("user");
    expect(result).toEqual({ _id: "1" });
  });

  it("creates a user lab entry", async () => {
    const payload = {
      user: "507f1f77bcf86cd799439011",
      lab: "507f1f77bcf86cd799439012",
      role: "PI",
    } as never;
    mockedUserLabModel.create.mockResolvedValue({ _id: "1", ...payload } as never);

    const result = await addUserLab(payload);

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(mockedUserLabModel.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ _id: "1", ...payload });
  });

  it("updates a user lab entry", async () => {
    mockedUserLabModel.findByIdAndUpdate.mockResolvedValue({
      _id: "1",
      role: "VIEWER",
    } as never);

    const result = await updateUserLab("abc123", { role: "VIEWER" } as never);

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(mockedUserLabModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "abc123",
      { role: "VIEWER" },
      { new: true }
    );
    expect(result).toEqual({ _id: "1", role: "VIEWER" });
  });

  it("deletes a user lab entry", async () => {
    mockedUserLabModel.findByIdAndDelete.mockResolvedValue({ _id: "1" } as never);

    const result = await deleteUserLab("abc123");

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(mockedUserLabModel.findByIdAndDelete).toHaveBeenCalledWith("abc123");
    expect(result).toEqual({ _id: "1" });
  });
});
