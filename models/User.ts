import mongoose, { Schema, Document } from "mongoose";

export type Role = "PI" | "LAB_MANAGER" | "RESEARCHER" | "VIEWER";

// describes what one lab membership looks like
export interface ILabMembership {
    labId: string;
    role: Role;
}

// shape of a user document in mongodb
export interface IUser extends Document {
    ucsdId: string; // ucsd pid
    email: string; // ucsd email
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

// mongoose schema to valid the data
const userSchema = new Schema<IUser>({

    ucsdId: { type: String }, // ucsd pid
    email: { type: String, required: true, unique: true }, // ucsd email

    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    permissions: [ // global roles - enum restricts to only these 4 valid roles
        { type: String, enum: ["PI", "LAB_MANAGER", "RESEARCHER", "VIEWER"] }
    ],
    
    // each entry represents membership in one lab

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
    notificationPreferences: { // default notification preferences
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
    },

    // checks for if you completed training and if you are cleared
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


//creates and exports the mongoosem odel
export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);