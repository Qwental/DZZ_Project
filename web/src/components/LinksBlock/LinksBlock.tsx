"use client";

import classNames from "classnames";
import styles from "./style.module.css";
import Link from "next/link";
import { FunctionComponent } from "react";

const LinksBlock: FunctionComponent = () => {
  return (
    <div className={styles.linksBlock}>
      <Link href="/login" className={styles.link}>
        Войти
      </Link>
      <Link
        href="/register"
        className={classNames(styles.link, styles.activeLink)}
      >
        Регистрация
      </Link>
    </div>
  );
};

export default LinksBlock;
