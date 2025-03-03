import styles from "./page.module.css";

export default function DahboardPage() {
    return (
      <div className={styles.page}>
        <div className={styles.resultsZone}></div>
        <div className={styles.profileZone}></div>
      </div>
    );
}