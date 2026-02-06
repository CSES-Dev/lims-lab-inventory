import { HydratedDocument, InferSchemaType, Model, Schema, model, models } from "mongoose";

// Fill enums with more items when more info is provided
export const categoryValues = ["consumable"] as const;
export const notificationEventValues = ["LOW_STOCK"] as const;
export const notificationAudienceValues = ["LAB_ADMINS"] as const;

const transformDocument = (_: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
};

// Making many assumptions how Item Schemas should work since only one example is provided
const thresholdSchema = new Schema(
    {
        minQuantity: { type: Number, required: true, min: 0},
        enabled: { type: Boolean, required: true, default: true},
        lastAlertSentAt: { type: Date, required: true},
    }
)

const notificationSchema = new Schema(
    {
        event: { type: String, enum: notificationEventValues, required: true},
        audience: { type: String, enum: notificationAudienceValues, required: true},
    }
)

const itemSchema = new Schema(
    {
        labId: { type: String, required: true, index: true},
        name: { type: String, required: true, trim: true},
        category: { type: String, enum: categoryValues, required: true},
        quantity: { type: Number, required: true, min: 0},

        threshold: { type: thresholdSchema, required: true},
        notificationPolicy: { type: notificationSchema, required: true},
    },
    {
        timestamps: true,
        toJSON: { virtuals: true, versionKey: false, transform: transformDocument },
        toObject: { virtuals: true, versionKey: false, transform: transformDocument },
    }
)

export type ItemInput = InferSchemaType<typeof itemSchema>;
export type ItemCategory = (typeof categoryValues)[number];
export type NotificationEvent = (typeof notificationEventValues)[number];
export type NotificationAudience = (typeof notificationAudienceValues)[number];
export type Item = ItemInput & { id: string };
export type ItemDocument = HydratedDocument<ItemInput>;

const ItemModel: Model<ItemInput> =
    (models.Item as Model<ItemInput>) || model<ItemInput>("Item", itemSchema);

export default ItemModel;