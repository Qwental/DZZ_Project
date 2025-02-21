import UploadCard from "@/components/card/UploadCard";
import styles from "./page.module.css";
import ResultCard from "@/components/card/ResultCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UploadCard></UploadCard>
        <ResultCard></ResultCard>
      </main>
    </div>
  );
}
