"use client";

import { SessionProvider } from "next-auth/react";
import NavigationProgressProvider from "./NavigationProgressProvider";
import type { ReactNode } from "react";

/**
 * Client-side context providers:
 * - SessionProvider: Required for useSession() in client components
 * - NavigationProgressProvider: Shows a loading bar between page transitions
 */
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <NavigationProgressProvider>{children}</NavigationProgressProvider>
        </SessionProvider>
    );
}
