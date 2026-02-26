import ItemModel, {
    Item,
    ItemCreateInput,
    ItemUpdateInput,
    toItem,
} from "@/models/Item";

/**
 * Returns all items (Likely unused in favor of filteredGet)
 * @returns all items in the form of a JS Object
 */
export async function getItems(): Promise<Item[]> {
    const items = await ItemModel.find().exec();
    return items.map(item => toItem(item));
}

// filteredGet here

/**
 * Returns an item by id
 * @param id the ID of the listing to get
 * @returns the listing in the form of a JS Object
 */
export async function getItem(id: string): Promise<Item | null> {
    const item = await ItemModel.findById(id).exec();
    return item ? toItem(item) : null;
}

/**
 * Adds an item. Should check for perms once RBAC has been implemented
 * @param newItem the new Item to add
 * @returns the added item in the form of a JS Object
 */
export async function addItem(newItem: ItemCreateInput): Promise<Item> {
    const created = await ItemModel.create(newItem);
    return toItem(created);
}

/**
 * Update listing item by id. Runs loose item schema validation
 * @param id the ID of the listing to update
 * @param data the data to update the listing with
 * @returns the updated listing or null if not found
 */
// If strict validation is wanted, use an upsert instead
export async function updateItem(
    id: string,
    data: ItemUpdateInput
): Promise<Item | null> {
    const updated = await ItemModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).exec();
    return updated ? toItem(updated) : null;
}

/**
 * Delete an item entry by ID
 * @param id the ID of the item to delete
 * @returns true if the item was deleted, false otherwise
 */
// Don't use this for tables where nothing needs to be deleted
// Could be accidentally or maliciously used to get rid of important data
export async function deleteItem(id: string): Promise<boolean> {
    const deleted = await ItemModel.findByIdAndDelete(id).exec();
    return Boolean(deleted);
}
