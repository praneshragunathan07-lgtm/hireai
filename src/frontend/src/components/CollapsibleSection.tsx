import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = true,
  children,
  className,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("card-elevated rounded-xl overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-smooth group"
        aria-expanded={isOpen}
        data-ocid="collapsible-toggle"
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && <span className="flex-shrink-0 text-primary">{icon}</span>}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-foreground text-base leading-tight">
                {title}
              </h3>
              {badge && <span className="flex-shrink-0">{badge}</span>}
            </div>
            {subtitle && (
              <p className="text-muted-foreground text-sm mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <span className="flex-shrink-0 text-muted-foreground ml-3 group-hover:text-foreground transition-smooth">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
