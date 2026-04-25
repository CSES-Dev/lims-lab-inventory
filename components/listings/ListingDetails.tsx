"use client";
import { useState } from "react";
import { Listing } from "@/models/Listing";
import { ContactModal } from "./ContactModal";
import styles from "./listing-view.module.css";

interface ListingDetailsProps {
  contactEmail: string;
  listing: Listing;
}

/**
 * Formats currency for listing prices.
 */
function formatPrice(price: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Formats an optional date for display.
 */
function formatDate(date?: Date | string) {
  if (!date) return "No expiry date listed";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "No expiry date listed";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

/**
 * Maps hazard labels to a stable visual style.
 */
function getHazardTone(hazard: string) {
  const normalized = hazard.toLowerCase();

  if (normalized.includes("chemical")) {
    return styles.hazardDanger;
  }

  if (normalized.includes("physical")) {
    return styles.hazardNeutral;
  }

  if (normalized.includes("biological")) {
    return styles.hazardMuted;
  }

  return styles.hazardWarning;
}

/**
 * Main listing view that renders content and handles contact modal state.
 */
export function ListingDetails({ contactEmail, listing }: ListingDetailsProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const listingMeta = [
    {
      label: "Lab",
      value: listing.labName || "Independent lab listing",
    },
    {
      label: "Location",
      value: listing.labLocation || "Location not provided",
    },
    {
      label: "Quantity available",
      value: String(listing.quantityAvailable),
    },
    {
      label: "Condition",
      value: listing.condition,
    },
    {
      label: "Status",
      value: listing.status,
    },
    {
      label: "Listing ID",
      value: listing.itemId,
    },
  ];

  return (
    <main className={styles.pageShell}>
      <section className={styles.page}>
        <div className={styles.topBar}>
          <a href="/listings" className={styles.backLink}>
            <span className={styles.page} aria-hidden="true">
              ←
            </span>
            <span>Back to Marketplace</span>
          </a>
        </div>

        <div className={styles.contentGrid}>
          {/* LEFT-SIDE PICTURES */}
          <section className={styles.galleryColumn}>
            <div className={styles.heroImageFrame} />
            <div className={styles.thumbnailRow}>
              <div className={styles.thumbnailButton} />
              <div className={styles.thumbnailButton} />
              <div className={styles.thumbnailButton} />
            </div>
          </section>

          {/* RIGHT-SIDE INFO */}
          <section className={styles.detailsColumn}>
            <div className={styles.headerBlock}>
              {listing.labName ? (
                <p className={styles.eyebrow}>{listing.labName}</p>
              ) : null}
              <h1 className={styles.title}>{listing.itemName}</h1>
              <p className={styles.price}>{formatPrice(listing.price)}</p>
            </div>

            <div className={styles.copyBlock}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>
                {listing.description || "No description has been added yet."}
              </p>
            </div>

            <div className={styles.statusPills}>
              <span className={styles.statusPill}>
                Expiry: {formatDate(listing.expiryDate!)}
              </span>
              <span className={styles.statusPill}>
                Condition: {listing.condition}
              </span>
            </div>

            <div className={styles.purchaseCard}>
              <div className={styles.quantityRow}>
                <span className={styles.quantityLabel}>Quantity</span>
                <div className={styles.quantityBadge}>
                  <span aria-hidden="true">−</span>
                  <span>1</span>
                  <span aria-hidden="true">+</span>
                </div>
              </div>

              <div className={styles.actionRow}>
                <button className={styles.secondaryAction} type="button">
                  Co-Purchase
                </button>
                <button
                  className={styles.primaryAction}
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Buy Now
                </button>
              </div>

              <div className={styles.metaPanel}>
                <h2 className={styles.panelTitle}>Potential Hazards</h2>
                <div className={styles.hazardGrid}>
                  {listing.hazardTags.length > 0 ? (
                    listing.hazardTags.map((hazard) => (
                      <span
                        key={hazard}
                        className={`${styles.hazardTag} ${getHazardTone(hazard)}`}
                      >
                        {hazard}
                      </span>
                    ))
                  ) : (
                    <span
                      className={`${styles.hazardTag} ${styles.hazardSafe}`}
                    >
                      No hazards listed
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.notesRow}>
                <span className={styles.notesLabel}>Notes &amp; Storage</span>
                <span className={styles.notesText}>
                  Store according to lab policy. Confirm condition and handling
                  requirements with the seller before pickup.
                </span>
              </div>
            </div>

            <div className={styles.metaGrid}>
              {listingMeta.map((item) => (
                <div className={styles.metaItem} key={item.label}>
                  <span className={styles.metaLabel}>{item.label}</span>
                  <span className={styles.metaValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <ContactModal
        contactEmail={contactEmail}
        isOpen={isContactModalOpen}
        listingName={listing.itemName}
        onClose={() => setIsContactModalOpen(false)}
      />
    </main>
  );
}
