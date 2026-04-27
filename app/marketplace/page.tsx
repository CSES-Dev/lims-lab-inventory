"use client";

import { useInventory } from "@/app/hooks/useInventory";
import type { Item } from "@/app/types/inventory";
import type { User } from "@/app/types/user";

// Mock user, replace with real auth hook later
const MOCK_USER: User = {
    id: "mock-user-id",
    ucsdId: "A12345678",
    email: "drxu@ucsd.edu",
    name: { first: "Dr. Xu", last: "" },
    role: "PI",
    labs: [{ labId: "lab-001", role: "PI" }],
    notificationPreferences: { email: true, sms: false, inApp: true },
    safety: { trainingCompleted: [], clearanceLevel: "", lastReviewedAt: "" },
    profile: { title: "Professor", department: "Chemistry", phone: "" },
    status: "ACTIVE",
    createdAt: "",
    lastLoginAt: "",
};

export default function MarketplacePage() {
    const currentUser = MOCK_USER;

    const { items, isLoading, error } = useInventory();
}
