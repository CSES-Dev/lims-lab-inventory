import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/Notification";

/**
 * Starts a Change Stream watcher on the "products" collection.
 * Inserts a DB_UPDATE notification whenever a product is updated.
 */
export async function startNotificationWatcher() {
  await connectToDatabase();

  const collection = mongoose.connection.collection("products");

  const changeStream = collection.watch([], {
    fullDocument: "updateLookup",
  });

  console.log("[notifications] watcher started");

  for await (const change of changeStream) {
    if (change.operationType !== "update") continue;

    const updatedDoc = change.fullDocument;
    if (!updatedDoc) continue;

    await Notification.create({
      _id: `notif_${Date.now()}`,
      type: "DB_UPDATE",
      labId: updatedDoc.labId ?? "unknown",
      resourceId: String(updatedDoc._id),
      recipients: [],
    });
  }
}
