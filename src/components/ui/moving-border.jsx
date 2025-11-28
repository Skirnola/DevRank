import React from "react";
import { cn } from "../../lib/utils"; // if you don't have cn, I'll give it below

export function MovingBorder({
  children,
  borderRadius = "9999px",
  className,
  containerClassName,
}) {
  return (
    <div
      className={cn("relative p-[2px] overflow-hidden", containerClassName)}
      style={{ borderRadius }}
    >
      {/* Animated Border */}
      <div
        className={cn(
          "absolute inset-0 -z-10 animate-border-moving bg-[linear-gradient(90deg,#a855f7,#ec4899,#a855f7)] bg-[length:200%_200%]",
          className
        )}
        style={{ borderRadius }}
      />

      {/* Actual Content */}
      {children}
    </div>
  );
}
