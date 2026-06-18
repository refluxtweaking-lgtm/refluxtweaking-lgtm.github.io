import Image from "next/image";
import Link from "next/link";
import { DiscordIcon } from "./DiscordIcon";

type ButtonVariant = "primary" | "discord" | "secondary" | "ghost";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  external?: boolean;
  download?: string | boolean;
  large?: boolean;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "btn-shimmer btn-glow-primary bg-gradient-to-r from-[#ff6b5b] to-[#e85548] text-white border-[rgba(255,107,91,0.5)] hover:brightness-110",
  discord:
    "bg-gradient-to-r from-[#5865f2] to-[#4752c4] text-white border-[#5865f2] shadow-[0_4px_20px_rgba(88,101,242,0.35)] hover:brightness-110",
  secondary:
    "reflux-glow-interactive bg-white/[0.04] text-reflux-text hover:bg-white/[0.07]",
  ghost:
    "reflux-glow-interactive bg-transparent text-reflux-muted hover:text-white hover:bg-white/[0.03]",
};

export function Button({
  href,
  variant = "primary",
  children,
  external = false,
  download,
  large = false,
  showIcon = false,
  className = "",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "font-display inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors duration-200 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reflux-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const sizeStyles = large ? "text-[15px] px-7 py-3.5 min-h-[48px]" : "text-sm px-5 py-2.5";

  const content = (
    <>
      {variant === "discord" && <DiscordIcon size={large ? 22 : 18} />}
      {showIcon && variant === "primary" && (
        <Image
          src="/favicon.ico"
          alt=""
          width={large ? 22 : 18}
          height={large ? 22 : 18}
          className="shrink-0 rounded-md"
        />
      )}
      {children}
    </>
  );

  const classes = `${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`;

  const isFileDownload = Boolean(download) || href.startsWith("/downloads/");
  const isCheckoutRedirect =
    href.startsWith("/api/checkout/") ||
    href === "/checkout/monthly" ||
    href === "/checkout/yearly" ||
    href === "/checkout/lifetime";

  if (isFileDownload || isCheckoutRedirect) {
    return (
      <a
        href={href}
        download={typeof download === "string" ? download : download ? "" : undefined}
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {content}
    </Link>
  );
}
