import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        department: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now }
    }
);

const LabModel = mongoose.models.Lab || mongoose.model("Lab", labSchema);
export default LabModel;