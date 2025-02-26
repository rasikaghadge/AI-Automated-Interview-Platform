import React from "react";
import styles from "./FullScreenModal.module.css";

const FullScreenModal = ({ children, onOk }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modal_content}>
          {children}
        </div>
        <div className={styles.modal_actions}>
          <button onClick={onOk} className={styles.modal_button}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
