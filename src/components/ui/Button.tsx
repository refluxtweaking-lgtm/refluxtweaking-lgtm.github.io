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
    "bg-reflux-accent text-white border-reflux-accent/80 hover:bg-[#ff7a6c] hover:border-[#ff7a6c]",
  discord:
    "bg-reflux-discord text-white border-reflux-discord hover:bg-[#6570f5] hover:border-[#6570f5]",
  secondary:
    "bg-transparent border border-white/12 text-reflux-text hover:border-white/20 hover:bg-white/[0.04]",
  ghost:
    "bg-transparent border border-reflux-border text-reflux-muted hover:border-white/15 hover:text-white hover:bg-white/[0.03]",
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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 border cursor-pointer";
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
