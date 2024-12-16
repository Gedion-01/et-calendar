import { useCallback, useEffect, useState } from "react";
import { Position, Placement } from "../types";
import { calculatePosition } from "../utils/calculatePosition";

export function usePosition(
  triggerRef: React.RefObject<HTMLButtonElement>,
  contentRef: React.RefObject<HTMLDivElement>,
  anchor: Placement = "bottom",
  align: "start" | "center" | "end" = "center",
  sideOffset: number = 8,
  alignOffset: number = 0,
  isOpen: boolean,
  setIsPositioned: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [actualPlacement, setActualPlacement] = useState<Placement>(anchor);

  const updatePosition = useCallback(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const { position: newPosition, actualPlacement: newPlacement } =
      calculatePosition(triggerRect, contentRect, {
        placement: anchor,
        align,
        sideOffset,
        alignOffset,
      });

    setPosition(newPosition);
    setActualPlacement(newPlacement);
    setIsPositioned(true);
    console.log("Position updated:", newPosition);
  }, [
    anchor,
    align,
    sideOffset,
    alignOffset,
    isOpen,
    triggerRef,
    contentRef,
    setIsPositioned,
  ]);

  useEffect(() => {
    updatePosition();

    const handleScroll = () => requestAnimationFrame(updatePosition);
    const handleResize = () => requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updatePosition]);

  return { position, placement: actualPlacement };
}
