import React, { useEffect, useRef, useState } from "react";
import { PopoverContext } from "./PopoverContext";
import "./Popover.css";

interface PopoverProps {
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Popover({
  children,
  className = "",
  onOpenChange,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  return (
    <PopoverContext.Provider
      value={{ isOpen, setIsOpen, triggerRef, contentRef }}
    >
      <div className={`popover ${className}`}>{children}</div>
    </PopoverContext.Provider>
  );
}
