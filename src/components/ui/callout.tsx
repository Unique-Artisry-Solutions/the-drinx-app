
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CalloutProps {
  /** The content of the callout */
  children: React.ReactNode;
  /** Icon to display with the callout (optional) */
  icon?: LucideIcon;
  /** Additional CSS classes to apply */
  className?: string;
  /** The visual variant of the callout */
  variant?: "default" | "info" | "warning" | "error" | "success";
}

/**
 * Callout component for displaying important information with optional icon
 */
export function Callout({
  children,
  icon: Icon,
  className,
  variant = "default",
}: CalloutProps) {
  const variantStyles = {
    default: "border-slate-200 bg-slate-50 text-slate-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
  };

  return (
    <div
      className={cn(
        "rounded-md border p-4 my-4",
        variantStyles[variant],
        className
      )}
    >
      {Icon && (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <div>{children}</div>
        </div>
      )}
      {!Icon && children}
    </div>
  );
}

export default Callout;
