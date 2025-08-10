import { ReactNode } from "react";
import "~~/styles/globals.css";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  animationDuration?: number;
}

export default function ShinyText({
  children,
  className = "",
  disabled = false,
  animationDuration = 3,
}: ShinyTextProps) {
  return <div className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}>{children}</div>;
}
