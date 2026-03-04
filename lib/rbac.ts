import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@/auth";
import { User, Role } from "@/models/User";

// establish the role permissions

const ROLE_PERMISSIONS: Record<Role, string[]> = {
    PI: [
        "inventory:create",
        "inventory:update",
        "inventory:delete",
        "inventory:set_threshold",
        "transfer:approve",
        "payment:approve",
        "lab:manage_users",
    ],
    LAB_MANAGER: [
        "inventory:create",
        "inventory:update",
        "inventory:set_threshold",
        "transfer:request"
    ],
    RESEARCHER: [
        "inventory:view",
        "transfer:request",
        "listing:create"
    ],
    VIEWER: [
        "inventory:view"
    ]
};

// checks if the user has permission to perform an action

export async function getSession(permission: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { allowed: false, user: null };
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user){
        return { allowed: false, user: null };
    }

    const allowed = (user.permissions as Role[]).some(
        (role) => ROLE_PERMISSIONS[role]?.includes(permission)
    );
    return { allowed, user };
}