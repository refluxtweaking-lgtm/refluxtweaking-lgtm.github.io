import { IconChip, type IconName } from "@/components/ui/Icon";

interface SlideHeadingProps {
  icon: IconName;
  title: string;
}

export function SlideHeading({ icon, title }: SlideHeadingProps) {
  return (
    <div className="mb-1 flex items-center justify-center gap-2 sm:mb-1.5 sm:gap-3">
      <IconChip name={icon} size={18} chipSize={32} className="sm:hidden" />
      <IconChip name={icon} size={22} chipSize={40} className="hidden sm:inline-flex" />
      <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
    </div>
  );
}
