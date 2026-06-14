import { IconChip, type IconName } from "@/components/ui/Icon";

interface SlideHeadingProps {
  icon: IconName;
  title: string;
}

export function SlideHeading({ icon, title }: SlideHeadingProps) {
  return (
    <div className="mb-2 flex items-center justify-center gap-3">
      <IconChip name={icon} size={22} chipSize={42} />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}
