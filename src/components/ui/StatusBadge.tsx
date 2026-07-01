import { Badge, type BadgeProps } from "./badge";
import { cn } from "@/lib/utils";

export type StepState = 'idle' | 'active' | 'comparing' | 'visited' | 'inserted' | 'removed' | 'error';

interface StatusBadgeProps extends BadgeProps {
  state: StepState;
}

export function StatusBadge({ state, className, ...props }: Readonly<StatusBadgeProps>) {
  const stateStyles: Record<StepState, string> = {
    idle: "bg-muted text-muted-foreground border-muted-foreground/20",
    active: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    comparing: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    visited: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    inserted: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    removed: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn("uppercase text-xs tracking-wider font-semibold", stateStyles[state], className)}
      {...props}
    >
      {state}
    </Badge>
  );
}
