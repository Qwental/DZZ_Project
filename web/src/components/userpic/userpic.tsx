"use client";
import Button from "@/components/button/button";
import styles from "./userpic.module.css";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const MoreInfo = dynamic(() => import("@/components/MoreInfo/moreinfo"));


export default function UserPic({ pic }: { pic: Result }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.card}>
      <Image
        src={pic.picSrc}
        alt="Файл"
        width={347}
        height={347}
        className={styles.image}
      />
      <span className={styles.date}>{pic.date}</span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="green"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Подробная информация
        </Button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <MoreInfo pic={pic} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
