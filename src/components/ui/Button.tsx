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
    "btn-shimmer bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] text-white border-[rgba(241,91,80,0.5)] hover:from-[rgba(241,91,80,0.45)] hover:to-[rgba(241,91,80,0.25)] hover:shadow-[0_0_32px_rgba(241,91,80,0.5)] hover:scale-[1.03] hover:border-reflux-accent",
  discord:
    "btn-shimmer bg-gradient-to-r from-[#5865f2] to-[#4752c4] text-white border-[#5865f2] hover:shadow-[0_0_32px_rgba(88,101,242,0.55)] hover:scale-[1.03]",
  secondary:
    "bg-[rgba(26,29,36,0.9)] border border-[#2A2F38] text-reflux-text hover:border-reflux-accent/50 hover:bg-[rgba(241,91,80,0.08)] hover:text-white hover:shadow-[0_0_20px_rgba(241,91,80,0.15)]",
  ghost:
    "bg-transparent border border-reflux-border/60 text-reflux-muted hover:border-reflux-accent/40 hover:text-white hover:bg-white/5",
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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 border cursor-pointer";
  const sizeStyles = large ? "text-base px-8 py-4 min-h-[52px]" : "text-sm px-5 py-2.5";

  const content = (
    <>
      {variant === "discord" && <DiscordIcon size={large ? 24 : 20} />}
      {showIcon && variant === "primary" && (
        <Image
          src="/favicon.ico"
          alt=""
          width={large ? 22 : 18}
          height={large ? 22 : 18}
          className="shrink-0 rounded-sm"
        />
      )}
      {children}
    </>
  );

  const classes = `${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`;

  const isFileDownload = Boolean(download) || href.startsWith("/downloads/");

  if (isFileDownload) {
    return (
      <a
        href={href}
        download={typeof download === "string" ? download : undefined}
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
