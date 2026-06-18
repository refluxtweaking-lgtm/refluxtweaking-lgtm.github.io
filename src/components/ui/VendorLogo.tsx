type VendorId = "intel" | "nvidia" | "amd" | "ram";

interface VendorLogoProps {
  vendor: VendorId;
  size?: number;
  className?: string;
}

export function VendorLogo({ vendor, size = 32, className = "" }: VendorLogoProps) {
  if (vendor === "intel") {
    return (
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className={className}
        aria-label="Intel"
        role="img"
      >
        <rect width="40" height="40" rx="9" fill="#0071C5" />
        <ellipse cx="20" cy="14" rx="9" ry="3.5" fill="none" stroke="#fff" strokeWidth="1.4" />
        <text
          x="20"
          y="27"
          textAnchor="middle"
          fill="#fff"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          intel
        </text>
      </svg>
    );
  }

  if (vendor === "nvidia") {
    return (
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className={className}
        aria-label="NVIDIA"
        role="img"
      >
        <rect width="40" height="40" rx="9" fill="#76B900" />
        <path
          d="M11 28 C11 18, 16 12, 20 12 C24 12, 29 18, 29 28"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M14 24 L20 14 L26 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        <text
          x="20"
          y="34"
          textAnchor="middle"
          fill="#fff"
          fontSize="5"
          fontWeight="800"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="0.5"
        >
          NVIDIA
        </text>
      </svg>
    );
  }

  if (vendor === "amd") {
    return (
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className={className}
        aria-label="AMD"
        role="img"
      >
        <rect width="40" height="40" rx="9" fill="#ED1C24" />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="900"
          fontFamily="Arial, Helvetica, sans-serif"
          fontStyle="italic"
        >
          AMD
        </text>
      </svg>
    );
  }

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
