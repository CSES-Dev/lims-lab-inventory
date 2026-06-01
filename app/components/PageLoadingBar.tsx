"use client";

import { useEffect, useState } from "react";

export default function PageLoadingBar() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        setProgress(10);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const increment = Math.random() * (15 - 5) + 5;
                return Math.min(prev + increment, 90);
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 90) {
            const timeout = setTimeout(() => {
                setProgress(100);
                setTimeout(() => setIsVisible(false), 300);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9998] pointer-events-none">
            <div className="h-1 w-full bg-gray-100/30 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#ea7032] to-[#ea7032] transition-all duration-300 ease-out shadow-lg"
                    style={{
                        width: `${progress}%`,
                        boxShadow:
                            progress < 100
                                ? "0 0 10px rgba(234, 112, 50, 0.7)"
                                : "none",
                    }}
                />
            </div>

            {progress < 100 && (
                <div
                    className="absolute top-0 left-0 h-1 bg-[#ea7032]/20 blur-sm transition-all duration-300"
                    style={{ width: `${progress + 5}%` }}
                />
            )}
        </div>
    );
}
