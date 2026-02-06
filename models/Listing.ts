import mongoose from "mongoose";

const { Schema, model } = mongoose;
const MONGODB_URI = process.env.DATABASE_URL!;

mongoose.connect(MONGODB_URI);

const listingSchema = new Schema({
  _id: { type: String, required: true },
  itemId: { type: String, required: true },
  labId: { type: String, required: true },
  quantityAvailable: { type: Number, required: true },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], required: true },
  createdAt: { type: Date, required: true },
});

listingSchema.index(
  {
    itemId: 1,
    labId: 1,
    createdAt: 1,
  },
  { unique: true }
);

const listing = mongoose.models.Listing || model("Listing", listingSchema);
export default listing;
