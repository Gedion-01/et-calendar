import React, { useRef, useState } from "react";
import { PopoverContext } from "./PopoverContext";
import "./Popover.css";

interface PopoverProps {
  children: React.ReactNode;
  className?: string;
}

export function Popover({ children, className = "" }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <PopoverContext.Provider
      value={{ isOpen, setIsOpen, triggerRef, contentRef }}
    >
      <div className={`popover ${className}`}>{children}</div>
    </PopoverContext.Provider>
  );
}
