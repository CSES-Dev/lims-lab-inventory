import { connectToDatabase } from "@/lib/mongoose";
import ItemModel, {
    Item,
    ItemCreateInput,
    ItemUpdateInput,
    toItem,
} from "@/models/Item";

// TODO ** Paginate and limit to 10 per page
// Build query with filters
export async function getItems(): Promise<Item[]> {
    await connectToDatabase();
    const items = await ItemModel.find().exec();
    return items.map(item => toItem(item));
}

export async function getItem(id: string): Promise<Item> {
    await connectToDatabase();
    const item = await ItemModel.findById(id).exec();

    if (item === null) {
        throw new Error("Item not found");
    }

    return toItem(item);
}

// Check for perms once RBAC has been implemented
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

    if (updated === null) {
        throw new Error("Item not found");
    }
    return toItem(updated);
}

// Concerned about potential unauthorized deletes as warned by demo.ts.
export async function deleteItem(id: string): Promise<boolean> {
    await connectToDatabase();

    const item = await ItemModel.findById(id).exec();
    if (item === null) {
        throw new Error("Item not found");
    }

    const result = await item.deleteOne();
    return result.deletedCount === 1;
}
