import mongoose from "mongoose";

// Lab Schema definition 
// Each lab has a unique ID, name, department, and a timestamp for when it was created
const labSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        department: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now }
    }
);

// Create and export the Lab model
const LabModel = mongoose.models.Lab || mongoose.model("Lab", labSchema);
export default LabModel;