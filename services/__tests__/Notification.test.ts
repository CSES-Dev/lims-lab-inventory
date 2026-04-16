jest.doMock("@/lib/mongoose", () => ({
  connectToDatabase: jest.fn(),
}));

jest.doMock("@/models/Notification", () => ({
  create: jest.fn(),
}));

import mongoose from "mongoose";

describe("startNotificationWatcher", () => {
  let startNotificationWatcher: any;
  let Notification: any;
  let connectToDatabase: jest.Mock;

  beforeAll(async () => {
    // IMPORTANT: import AFTER mocks
    ({ startNotificationWatcher } = await import("../notifications/watchUpdates"));
    ({ default: Notification } = await import("@/models/Notification"));
  });

  test("creates notification", async () => {
    const mockCollection = {
      watch: jest.fn(),
    };

    (mongoose.connection.collection as jest.Mock).mockReturnValue(mockCollection);

    mockCollection.watch.mockReturnValue({
      async *[Symbol.asyncIterator]() {
        yield {
          operationType: "update",
          fullDocument: { _id: "item1", labId: "lab1" },
        };
      },
    });

    Notification.create.mockResolvedValue({});

    await startNotificationWatcher();
  });
});