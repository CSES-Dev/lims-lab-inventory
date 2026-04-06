import { connectToDatabase } from "@/lib/mongoose";
import UserLab from "@/models/UserLab";

export async function getUserLabs() {
  await connectToDatabase();
  return UserLab.find().populate("user").populate("lab");
}

export async function getUserLab(id: string) {
  await connectToDatabase();
  return UserLab.findById(id).populate("user").populate("lab");
}

export async function addUserLab(data: any) {
  await connectToDatabase();
  return UserLab.create(data);
}

export async function updateUserLab(id: string, update: any) {
  await connectToDatabase();
  return UserLab.findByIdAndUpdate(id, update, { new: true });
}

export async function deleteUserLab(id: string) {
  await connectToDatabase();
  return UserLab.findByIdAndDelete(id);
}
