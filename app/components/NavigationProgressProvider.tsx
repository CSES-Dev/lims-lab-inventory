"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoadingBar from "./PageLoadingBar";
import type { ReactNode } from "react";

export default function NavigationProgressProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [showProgress, setShowProgress] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const originalPush = router.push;
        const originalReplace = router.replace;

        const handleNavigationStart = () => {
            setShowProgress(true);
        };

        const wrappedPush = (href: string, options?: any) => {
            handleNavigationStart();
            return originalPush.call(router, href, options);
        };

        const wrappedReplace = (href: string, options?: any) => {
            handleNavigationStart();
            return originalReplace.call(router, href, options);
        };

        router.push = wrappedPush;
        router.replace = wrappedReplace;

        const handlePopState = () => {
            handleNavigationStart();
        };

        window.addEventListener("popstate", handlePopState);

        const timeoutId = setTimeout(() => {
            setShowProgress(false);
        }, 5000);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            clearTimeout(timeoutId);
            router.push = originalPush;
            router.replace = originalReplace;
        };
    }, [router]);

    return (
        <>
            {showProgress && <PageLoadingBar />}
            {children}
        </>
    );
}
