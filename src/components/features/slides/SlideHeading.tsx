import { IconChip, type IconName } from "@/components/ui/Icon";

interface SlideHeadingProps {
  icon: IconName;
  title: string;
}

export function SlideHeading({ icon, title }: SlideHeadingProps) {
  return (
    <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-2 sm:gap-3">
      <IconChip name={icon} size={20} chipSize={36} className="sm:hidden" />
      <IconChip name={icon} size={22} chipSize={42} className="hidden sm:inline-flex" />
      <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
    </div>
  );
}
