'use client';

interface SectionHeaderProps {
  title: string;
  count: number;
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground/80">{count}</span>
    </div>
  );
}
