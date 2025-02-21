import styles from "./page.module.css";
import Button from "@/components/button/button";
import ResultCard from "@/components/card/ResultCard";
import Input from "@/components/inputs/input";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Input variant="people" className={"people_test"} placeholder={"Логин"}></Input>
        <Button variant="mint" size="medium">
          I am button!!!!!!!!!!
        </Button>
        <Button variant="green" size="small">
          I am button!!!!!!!!!!
        </Button>
        <Button variant="saphire" size="large">
          I am button!!!!!!!!!!
        </Button>
        <ResultCard></ResultCard>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
