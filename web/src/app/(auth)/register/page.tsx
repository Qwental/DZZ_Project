"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/inputs/input";
import Button from "@/components/button/button";
import styles from "./page.module.css";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import LinksBlock from "@/components/LinksBlock/LinksBlock";

interface RegData {
  lastName: string;
  firstName: string;
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegData>({
    lastName: "",
    firstName: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  function nextStep(e: { preventDefault: () => void }) {
    e.preventDefault();
    setStep((prev) => prev + 1);
  }

  function prevStep(e: { preventDefault: () => void }) {
    e.preventDefault();
    setStep((prev) => prev - 1);
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Пароли не совпадают");
      }

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          lastName: formData.lastName,
          firstName: formData.firstName,
          email: formData.email,
          login: formData.login,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      router.push("/login");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className={styles.main}>
      {" "}
      <form className={styles.form} onSubmit={handleSubmit} method="POST">
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
        <div className={styles.item}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              {" "}
              <h2 className={styles.title}>Регистрация</h2>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <Input
                  placeholder="Фамилия"
                  name="lastName"
                  variant="people"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.surname
                  )}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Имя"
                  variant="people"
                  name="firstName"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.name
                  )}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Почта"
                  variant="mail"
                  name="email"
                  type="email"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.email
                  )}
                  value={formData.email}
                  onChange={handleChange}
                />
                <Button
                  variant="saphire"
                  size="large"
                  onClick={nextStep}
                  style={{ marginTop: "1rem" }}
                  type="button"
                >
                  Продолжить →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <Input
                  placeholder="Логин"
                  name="login"
                  variant="people"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.login
                  )}
                  value={formData.login}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Пароль"
                  name="password"
                  type="password"
                  variant="pass"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.pass1
                  )}
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Повторите пароль"
                  name="confirmPassword"
                  type="password"
                  variant="pass"
                  required
                  className={classNames(
                    styles.input,
                    styles.otstupiki,
                    styles.pass2
                  )}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className={styles.buttonGroup}>
                  <Button
                    onClick={prevStep}
                    variant="saphire"
                    size="large"
                    type="submit"
                  >
                    ← Назад
                  </Button>
                  <Button type="submit">Зарегистрироваться</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
