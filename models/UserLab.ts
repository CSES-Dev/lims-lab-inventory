import mongoose, { Schema, Document, Types } from "mongoose";

export type UserLabRole = "member" | "lead" | "admin";

export interface IUserLab extends Document {
  user: Types.ObjectId;
  lab: Types.ObjectId;
  role: UserLabRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userLabSchema = new Schema<IUserLab>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lab: {
      type: Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "lead", "admin"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userLabSchema.index({ user: 1, lab: 1 }, { unique: true });

const UserLab =
  mongoose.models.UserLab || mongoose.model<IUserLab>("UserLab", userLabSchema);

export default UserLab;
