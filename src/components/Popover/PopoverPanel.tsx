import React, { useEffect } from "react";
import { usePopoverContext } from "./PopoverContext";
import { calculatePosition } from "../../utils/calculatePosition";
import "./Popover.css";
import { Alignment, Placement } from "../../types";

export interface PopoverPanelProps {
  children: React.ReactNode;
  className?: string;
  anchor?: Placement;
  align?: Alignment;
  sideOffset?: number;
  alignOffset?: number;
}

export function PopoverPanel({
  children,
  className = "",
  anchor = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
}: PopoverPanelProps) {
  const { isOpen, setIsOpen, triggerRef, contentRef } = usePopoverContext();

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();

      if (!triggerRect || !contentRect) return;

      const { position, actualPlacement } = calculatePosition(
        triggerRect,
        contentRect,
        {
          placement: anchor,
          align,
          sideOffset,
          alignOffset,
        }
      );

      if (contentRef.current) {
        contentRef.current.style.left = `${position.x}px`;
        contentRef.current.style.top = `${position.y}px`;
        contentRef.current.dataset.placement = actualPlacement;
      }
    };

    updatePosition();

    const handleScroll = () => requestAnimationFrame(updatePosition);
    const handleResize = () => requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, anchor, align, sideOffset, alignOffset]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`popover-panel ${className}`}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
      }}
      role="dialog"
    >
      {children}
    </div>
  );
}
