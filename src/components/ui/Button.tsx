import Image from "next/image";
import Link from "next/link";
import { DiscordIcon } from "./DiscordIcon";

type ButtonVariant = "primary" | "discord" | "secondary" | "ghost";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  external?: boolean;
  /** Triggers a browser file download (same-origin paths only). */
  download?: string | boolean;
  large?: boolean;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "btn-shimmer btn-glow-primary bg-gradient-to-r from-[#ff6b5b] via-[#ff7a6a] to-[#e85548] text-white border-[rgba(255,107,91,0.5)] hover:brightness-110 hover:border-[rgba(255,255,255,0.2)]",
  discord:
    "bg-gradient-to-r from-[#5865f2] to-[#4752c4] text-white border-[#5865f2] shadow-[0_4px_24px_rgba(88,101,242,0.35)] hover:brightness-110 hover:shadow-[0_8px_32px_rgba(88,101,242,0.45)]",
  secondary:
    "bg-white/[0.04] border border-white/12 text-reflux-text backdrop-blur-sm hover:border-white/22 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
  ghost:
    "bg-transparent border border-reflux-border/60 text-reflux-muted hover:border-white/18 hover:text-white hover:bg-white/[0.04]",
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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 border cursor-pointer hover:-translate-y-0.5 active:translate-y-0";
  const sizeStyles = large ? "text-base px-8 py-4 min-h-[52px]" : "text-sm px-5 py-2.5";

  const content = (
    <>
      {variant === "discord" && <DiscordIcon size={large ? 24 : 20} />}
      {showIcon && variant === "primary" && (
        <Image
          src="/favicon.ico"
          alt=""
          width={large ? 24 : 20}
          height={large ? 24 : 20}
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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
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
