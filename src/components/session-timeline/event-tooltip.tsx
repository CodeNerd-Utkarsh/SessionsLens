
"use client";

import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventTooltipProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function EventTooltip({ trigger, content, side = "top", align = "center" }: EventTooltipProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side={side} align={align} className="bg-card text-card-foreground shadow-lg rounded-md p-2 text-xs max-w-xs break-words">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
