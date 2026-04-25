"use client";
import { useEffect } from "react";
import styles from "./contact-modal.module.css";

interface ContactModalProps {
  contactEmail: string;
  isOpen: boolean;
  listingName: string;
  onClose: () => void;
}

/**
 * Accessible contact modal used by the buy button.
 */
export function ContactModal({
  contactEmail,
  isOpen,
  listingName,
  onClose,
}: ContactModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className={styles.dialog}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close contact seller dialog"
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <p className={styles.kicker}>Contact Seller</p>
        <h2 className={styles.title} id="contact-modal-title">
          {listingName}
        </h2>
        <p className={styles.description}>
          Stripe is not connected yet, so the next step is to contact the seller
          directly by email.
        </p>

        <a className={styles.emailLink} href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>

        <div className={styles.footer}>
          <button
            className={styles.secondaryButton}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <a className={styles.primaryButton} href={`mailto:${contactEmail}`}>
            Email Seller
          </a>
        </div>
      </div>
    </div>
  );
}
