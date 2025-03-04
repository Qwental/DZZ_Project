"use client";

import Button from "@/components/button/button";
import styles from "./userPhotos.module.css";
import Image from "next/image";
import router from "next/router";

export default function UserPhotos({ pics }: { pics: Result[] }) {
  return (
    <div className={styles.profile}>
      {pics.map((elem, index) => (
        <div key={index}>{elem.date}</div>
      ))}
    </div>
  );
}
