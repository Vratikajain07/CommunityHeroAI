import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  accent?: boolean;
  dark?: boolean;
  hoverable?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  id,
  accent = false,
  dark = false,
  hoverable = false,
}: GlassCardProps) {
  let baseClass = "glass";
  if (accent) baseClass = "glass-accent";
  if (dark) baseClass = "glass-dark";

  const hoverClass = hoverable
    ? "transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_24px_rgba(14,165,233,0.15)] hover:border-[rgba(14,165,233,0.3)]"
    : "";

  return (
    <div
      id={id}
      className={`rounded-3xl p-6 ${baseClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
