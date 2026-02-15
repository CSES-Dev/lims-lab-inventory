import type { HydratedDocument } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import ItemModel, {
    Item,
    ItemInput,
    ItemCreateInput,
    ItemUpdateInput,
} from "@/models/Item";

type ItemDocument = HydratedDocument<ItemInput>;

const toItem = (doc: ItemDocument): Item => doc.toObject<Item>();

export async function getItems(): Promise<Item[]> {
    await connectToDatabase();
    const items = await ItemModel.find().exec();
    return items.map(item => toItem(item));
}

export async function getItem(id: string): Promise<Item | null> {
    await connectToDatabase();
    const item = await ItemModel.findById(id).exec();
    return item ? toItem(item) : null;
}

export async function addItem(newItem: ItemCreateInput): Promise<Item> {
    await connectToDatabase();
    const created = await ItemModel.create(newItem);
    return toItem(created);
}

export async function updateItem(
    id: string,
    data: ItemUpdateInput
): Promise<Item | null> {
    await connectToDatabase();
    const updated = await ItemModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).exec();
    return updated ? toItem(updated) : null;
}

// Concerned about potential unauthorized deletes as warned by demo.ts.
export async function deleteItem(id: string): Promise<boolean> {
    await connectToDatabase();
    const deleted = await ItemModel.findByIdAndDelete(id).exec();
    return Boolean(deleted);
}
