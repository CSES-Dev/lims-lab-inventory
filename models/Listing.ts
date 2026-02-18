import mongoose from "mongoose";
import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;
mongoose.connect(MONGODB_URI);

const transformDocument = (_: unknown, ret: Record<string, unknown>) => {
  ret.id = ret._id?.toString();
  delete ret._id;
  return ret;
}; // for properly handling toObject() or toJSON() and stringifying id

const listingSchema = new Schema(
  {
    itemId: { type: String, required: true },
    labId: { type: String, required: true },
    quantityAvailable: { type: Number, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], required: true },
    createdAt: { type: Date, required: true },
  },
  {
    toJSON: { virtuals: true, versionKey: false, transform: transformDocument },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformDocument,
    },
  }
);

// for filtering
listingSchema.index({ labId: 1, createdAt: -1 });
listingSchema.index({ itemId: 1, createdAt: -1 });

export type ListingInput = InferSchemaType<typeof listingSchema>;
export type Listing = ListingInput & { id: string };
export type ListingDocument = HydratedDocument<ListingInput>;

const ListingModel: Model<ListingInput> =
  (models.Listing as Model<ListingInput>) ||
  model<ListingInput>("Listing", listingSchema);
export default ListingModel;
