"use client";

import { useState } from "react";
import styles from "./MarketplaceFilters.module.css";

export type FilterState = {
    search: string;
    category: "" ;
    labId: string;
    condition: string | "";
    expiryFilter: "all" | "expired" | "expiring-soon";
};

type Props = {
    labOptions: { id: string; name: string }[];
    onChange: (filters: FilterState) => void;
};

export default function MarketplaceFilters({ labOptions: _labOptions, onChange }: Props) {
    const [search, setSearch] = useState("");

    function handleSearch(value: string) {
        setSearch(value);
        onChange({ search: value, category: "", labId: "", condition: "", expiryFilter: "all" });
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchBar}>
                <svg
                    className={styles.searchIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                </svg>

                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
        </div>
    );
}