import { HydratedDocument, InferSchemaType, Model, Schema, model, models } from "mongoose";

const transformDocument = (_: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
};

/**
 * Lab Schema Definition
 * This schema defines the structure of a lab entry in the inventory system. 
 * Each lab has a unique name, department, and a timestamp for when it was 
 * created.
 */
const labSchema = new Schema(
    {
        name: { type: String, required: true },
        department: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now }
    },
    {
        toJSON: { virtuals: true, versionKey: false, transform: transformDocument },
        toObject: { virtuals: true, versionKey: false, transform: transformDocument },
    }
);

// Create and export the Lab model 
export type LabInput = InferSchemaType<typeof labSchema>;
export type Lab = LabInput & { id: string };
export type LabDocument = HydratedDocument<LabInput>;

const LabModel: Model<LabInput> = 
    (models.Lab as Model<LabInput>) || model<LabInput>("Lab", labSchema);

export default LabModel;