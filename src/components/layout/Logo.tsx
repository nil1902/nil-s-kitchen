import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const variantClasses = {
    default: "text-amber-600",
    light: "text-white",
    dark: "text-amber-800",
  };

  return (
    <Link
      to="/"
      className={`flex items-center ${className}`}
              aria-label="Bengal Bay Home"
    >
      <div className="flex items-center">
        <img
          src="./assets/images/logo/nils-kitchen-logo.svg"
          alt="Bengal Bay Logo"
          className={`h-auto ${size === "sm" ? "w-24" : size === "md" ? "w-32" : "w-40"}`}
        />
      </div>
    </Link>
  );
};

export default Logo;
