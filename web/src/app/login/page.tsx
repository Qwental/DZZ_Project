"use client";
import { FormEvent } from "react";
import Input from "@/components/inputs/input";
import Button from "@/components/button/button";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import styles from "./page.module.css";
import LinksBlock from "@/components/LinksBlock/LinksBlock";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    if (response.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Левая колонка с картинкой */}
        <div
          className={styles.item}
          style={{
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LinksBlock />
          <img
            src="bird_with_circle.png"
            alt="Лого"
            style={{
              marginTop: "0px",
              width: "29.02vw",
              height: "62.44vh",
              // height: "auto",
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Правая колонка с формой */}
        <div className={styles.item} style={{ padding: "2rem" }}>
          <h2 className={styles.title}>Вход</h2>
          <Input
            variant="people"
            placeholder="Логин"
            required
            className={classNames(styles.otstupiki, styles.login)}
            name="login"
            style={{ marginBottom: "1vh" }}
          />
          <Input
            variant="pass"
            className={classNames(styles.otstupiki, styles.pass)}
            placeholder="Пароль"
            type="password"
            name="password"
            required
          />
          <Button
            variant="saphire"
            size="large"
            type="submit"
            style={{ marginTop: "2rem" }}
          >
            Войти
          </Button>
        </div>
      </form>
    </div>
  );
}
