import React from "react";
import { usePopoverContext } from "./PopoverContext";

export interface PopoverButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function PopoverButton({ children, className }: PopoverButtonProps) {
  const { isOpen, setIsOpen, triggerRef } = usePopoverContext();

  console.log(className);

  return (
    <button
      ref={triggerRef}
      className={`${className}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      type="button"
    >
      {children}
    </button>
  );
}
