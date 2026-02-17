import type { HydratedDocument }from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import LabModel, { Lab, LabInput } from "@/models/Lab";

type LabDocument = HydratedDocument<LabInput>;

const toLab = (doc: LabDocument): Lab => doc.toObject<Lab>();

/**
 * Get all lab entries
 * @returns an array of labs
 */
export async function getLabs(): Promise<Lab[]> {
    await connectToDatabase();
    const labs = await LabModel.find().exec();
    return labs.map(lab => toLab(lab));

}

/**
 * Get a lab entry by ID
 * @param id the ID of the lab to fetch
 * @returns the lab
 */
export async function getLab(id: string): Promise<Lab | null> {
    await connectToDatabase();
    const lab = await LabModel.findById(id).exec();
    return lab ? toLab(lab) : null;
}

/**
 * Add a new lab entry
 * @param newLab the lab data to add
 * @returns the created lab
 */
export async function addLab(newLab: Lab): Promise<Lab> {
    await connectToDatabase();
    const createdLab = await LabModel.create(newLab);
    return toLab(createdLab);
}

/**
 * Update a lab entry by ID
 * @param id the ID of the lab to update
 * @param data the data to update
 * @returns the updated lab or null if not found
 */
export async function updateLab(
    id: string,
    data: Partial<Lab>,
): Promise<Lab | null> {
    await connectToDatabase();
    const updatedLab = await LabModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).exec();
    return updatedLab ? toLab(updatedLab) : null;
}

/**
 * Delete a lab entry by ID
 * @param id the ID of the lab to delete
 * @returns true if the lab was deleted, false otherwise
 */
// DON'T use this for tables that you don't actually need to potentially delete things from
// Could be used accidentally or misused maliciously to get rid of important data
export async function deleteLab(id: string): Promise<boolean> {
    await connectToDatabase();
    const deleted = await LabModel.findByIdAndDelete(id).exec();
    return Boolean(deleted);
}