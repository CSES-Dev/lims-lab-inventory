import mongoose from "mongoose";

const mockCollection = {
  watch: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(mongoose.connection, "collection").mockReturnValue(mockCollection as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock("mongoose", () => {
  const mockWatch = jest.fn();
  const mockCollection = { watch: mockWatch };
  return {
    ...jest.requireActual("mongoose"),
    connection: {
      collection: jest.fn(() => mockCollection),
    },
  };
});

describe("startNotificationWatcher", () => {
  let startNotificationWatcher: any;
  let Notification: any;

  beforeAll(async () => {
    ({ startNotificationWatcher } = await import("../notifications/watchUpdates"));
    ({ default: Notification } = await import("../../models/Notification"));
  });

test("creates notification on update event", async () => {
const fakeStream = {
    async *[Symbol.asyncIterator]() {
    yield {
        operationType: "update",
        fullDocument: {
        _id: "item1",
        labId: "lab1",
        },
    };
    },
};

    jest.spyOn(mongoose.connection, "collection").mockReturnValue({
      watch: jest.fn(() => fakeStream),
    } as any);

    await startNotificationWatcher();

    expect(Notification.create).toHaveBeenCalled();
  });
});