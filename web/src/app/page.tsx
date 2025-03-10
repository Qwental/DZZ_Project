import styles from "./page.module.css";
import Button from "@/components/button/button";
import ResultCard from "@/components/card/ResultCard";
import Hero from "@/components/hero/hero";
import Input from "@/components/inputs/input";
import Instruction from "@/components/instruction/instruction";

export default function Home() {
  return (
    <main>
      <Hero/>
      <Instruction/>
    </main>
  );
}
