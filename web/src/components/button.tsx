"use client"
import classNames from "classnames";
import styles from "./button.module.css";

/**
 * вариации кнопочек по дизайну, существует 4:
 * дефолтная - по умолчанию
 * saphire - рега, кнопки подробнее и тд
 * green - для подтверждения вводов
 * mint - назад
 */
type ButtonVariant = "default" | "mint" | "green" | "saphire";
/**
 * Размеры
 * TODO: убрать какие-то лишние
 */
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "medium",
  children,
  ...props
}) => {
  const buttonClass = classNames(styles.button, styles[variant], styles[size]);

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
