import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [canPortal, setCanPortal] = useState(false);

  useEffect(() => {
    setCanPortal(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const panel = contentRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;

    const updatePosition = () => {
      // Viewport coordinates: the panel is portalled to <body> and positioned
      // `fixed`, so it is not affected by any transformed/filtered ancestor
      // (which would otherwise become its containing block and shift it).
      const triggerRect = trigger.getBoundingClientRect();

      // Layout size, not the bounding rect -- the entrance animation scales the
      // panel, and getBoundingClientRect() would report the scaled size.
      const panelSize = {
        width: panel.offsetWidth,
        height: panel.offsetHeight,
      };

      const { position, actualPlacement } = calculatePosition(
        triggerRect,
        panelSize,
        { placement: anchor, align, sideOffset, alignOffset }
      );

      panel.style.left = `${position.x}px`;
      panel.style.top = `${position.y}px`;
      panel.dataset.placement = actualPlacement;
    };

    updatePosition();

    // The panel resizes while open (5 vs 6 week rows, tab switch, late fonts),
    // so re-position whenever its layout size changes.
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => updatePosition());
    observer?.observe(panel);

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isOpen, anchor, align, sideOffset, alignOffset, triggerRef, contentRef]);

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
  }, [isOpen, setIsOpen, contentRef, triggerRef]);

  if (!isOpen || !canPortal) return null;

  return createPortal(
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
    </div>,
    document.body
  );
}
