import Image from "next/image";

/** Sharp 256×256 R mark for header / app mock bars (not the browser-tab favicon). */
export const BRAND_MARK_SRC = "/brand-mark.png";

interface BrandMarkProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandMark({ size = 40, className = "", priority = false }: BrandMarkProps) {
  return (
    <Image
      src={BRAND_MARK_SRC}
      alt=""
      width={size}
      height={size}
      quality={100}
      unoptimized
      priority={priority}
      className={className}
    />
  );
}
