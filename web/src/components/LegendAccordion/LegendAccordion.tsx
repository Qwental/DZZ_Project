import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

type Types = "forest" | "plow" | "felling" | "blaze";

const LegendAccordion = ({ type }: { type: Types }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(type);

  return (
    <div className={styles.legendContainer}>
      <button
        className={styles.legendHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className={styles.markerIcon}
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9.5" cy="9.5" r="9.5" fill="#FF0000" />
        </svg>
        <span className={styles.legendTitle}>Гарь</span>
        <motion.span
          className={styles.arrow}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>

      <motion.div
        className={styles.legendContent}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className={styles.legendDescription}>
          Территория, пострадавшая от лесного пожара.
        </p>
      </motion.div>
    </div>
  );
};

export default LegendAccordion;
