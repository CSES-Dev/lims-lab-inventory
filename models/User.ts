    import mongoose, { Schema, Document } from "mongoose";

    export type Role = "PI" | "LAB_MANAGER" | "RESEARCHER" | "VIEWER";

    // describes what one lab membership looks like
    export interface ILabMembership {
        labId: string;
        role: Role;
    }

    // shape of a user document in mongodb
    export interface IUser extends Document {
        ucsdId: string;
        email: string;
        name: {
            first: string;
            last: string;
        };
        permissions: Role[];
        labs: ILabMembership[];
        notificationPreferences: {
            email: boolean;
            sms: boolean;
            inApp: boolean;
        };
        safety: {
            trainingCompleted: string[];
            clearanceLevel: string;
            lastReviwedAt: Date;
        };
        profile: {
            title: string;
            department: string;
            phone: string;
        }
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
        createdAt: Date;
        lastLoginAt: Date;
    }


const userSchema = new Schema<IUser>({
    ucsdId: { type: String },
    email: { type: String, required: true, unique: true },

    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    permissions: [
        { type: String, enum: ["PI", "LAB_MANAGER", "RESEARCHER", "VIEWER"] }
    ],

    labs: [
        {
            labId: { type: String, required: true },
            role: {
                type: String,
                enum: ["PI", "LAB_MANAGER", "RESEARCHER", "VIEWER"],
                required: true,
            },
        },
    ],
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
    },
    safety: {
        trainingCompleted: [{ type: String }],
        clearenceLevel: { type: String },
        lastReviewedAt: { type: Date },
    },

    profile: {
        title: { type: String },
        department: { type: String },
        phone: { type: String },
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        default: "ACTIVE",
    },
    lastLoginAt: { type: Date },

},
{
    timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);