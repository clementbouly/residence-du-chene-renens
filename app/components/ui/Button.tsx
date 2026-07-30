import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "compact" | "icon" | "menu";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      size = "default",
      type = "button",
      variant = "primary",
      ...props
    },
    ref,
  ) {
    const classes = [
      styles.button,
      styles[variant],
      size !== "default" ? styles[size] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={classes} type={type} {...props} />;
  },
);
