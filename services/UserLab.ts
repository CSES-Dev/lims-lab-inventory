import { connectToDatabase } from "@/lib/mongoose";
import { IUserLab } from "@/models/UserLab";
import UserLab from "@/models/UserLab";

export type GetUserLabsOptions = {
  page: number;
  limit: number;
};

export type UserLabPayload = Pick<IUserLab, "user" | "lab" | "role">;

export async function getUserLabs({ page, limit }: GetUserLabsOptions) {
  await connectToDatabase();
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    UserLab.find().skip(skip).limit(limit).populate("user").populate("lab"),
    UserLab.countDocuments(),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getUserLab(id: string) {
  await connectToDatabase();
  return UserLab.findById(id).populate("user").populate("lab");
}

export async function addUserLab(data: UserLabPayload) {
  await connectToDatabase();
  return UserLab.create(data);
}

export async function updateUserLab(id: string, update: Partial<UserLabPayload>) {
  await connectToDatabase();
  return UserLab.findByIdAndUpdate(id, update, { new: true });
}

export async function deleteUserLab(id: string) {
  await connectToDatabase();
  return UserLab.findByIdAndDelete(id);
}
