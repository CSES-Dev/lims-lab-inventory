import { useState } from "react";
import styles from "./CoPurchase.module.css";

const CloseIcon = () => (
  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.4385 8.14648L8.14624 24.4387" stroke="#0A0A0A" stroke-width="2.71537" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.14624 8.14648L24.4385 24.4387" stroke="#0A0A0A" stroke-width="2.71537" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

interface InviteModalProps {
  onClose: () => void;
  onSend: (email: string) => void;
}

export default function CopurchaseInvite({ onClose, onSend }: InviteModalProps) {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    onSend(email);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
        <CloseIcon />
      </button>

      <div className={styles.header}>
        <div className={styles.title}>Invite to Co-purchase</div>
        <div className={styles.subtitle}>
          Invite other labs or colleagues to split the cost of this item.
        </div>
      </div>

      <input
        className={styles.input}
        type="email"
        value={email}
        placeholder="colleague@ucsd.edu"
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.btnPrimary} onClick={handleSend}>
          Send Invites
        </button>
      </div>
    </div>
  );
}