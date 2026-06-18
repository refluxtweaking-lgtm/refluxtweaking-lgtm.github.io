import Image from "next/image";

type VendorId = "intel" | "nvidia" | "amd" | "ram";

interface VendorLogoProps {
  vendor: VendorId;
  size?: number;
  className?: string;
}

const BRAND_META: Record<Exclude<VendorId, "ram">, { src: string; label: string; bg: string }> = {
  intel: { src: "/logos/intel.svg", label: "Intel", bg: "#0071C5" },
  nvidia: { src: "/logos/nvidia.svg", label: "NVIDIA", bg: "#76B900" },
  amd: { src: "/logos/amd.svg", label: "AMD", bg: "#ED1C24" },
};

export function VendorLogo({ vendor, size = 32, className = "" }: VendorLogoProps) {
  if (vendor === "ram") {
    return (
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className={className}
        aria-label="Memory"
        role="img"
      >
        <rect width="40" height="40" rx="9" fill="#7c3aed" />
        <rect x="10" y="14" width="20" height="12" rx="2" fill="none" stroke="#fff" strokeWidth="1.6" />
        <line x1="13" y1="20" x2="27" y2="20" stroke="#fff" strokeWidth="1.4" />
        <line x1="13" y1="17" x2="27" y2="17" stroke="#fff" strokeWidth="1" opacity="0.65" />
        <line x1="13" y1="23" x2="27" y2="23" stroke="#fff" strokeWidth="1" opacity="0.65" />
      </svg>
    );
  }

  const brand = BRAND_META[vendor];
  const pad = Math.round(size * 0.2);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[9px] ${className}`}
      style={{ width: size, height: size, background: brand.bg }}
      aria-label={brand.label}
      role="img"
    >
      <Image
        src={brand.src}
        alt={brand.label}
        width={size - pad * 2}
        height={size - pad * 2}
        className="absolute brightness-0 invert"
        style={{ top: pad, left: pad, width: size - pad * 2, height: size - pad * 2 }}
      />
    </div>
  );
}
