import { Position, Placement, Alignment, PositionConfig } from "../types";

const VIEWPORT_PADDING = 8;

function calculateAlignmentOffset(
  basePosition: Position,
  triggerRect: DOMRect,
  contentRect: DOMRect,
  align: Alignment,
  alignOffset: number,
  isVertical: boolean
): Position {
  let x = basePosition.x;
  let y = basePosition.y;

  if (isVertical) {
    // For left/right placement
    switch (align) {
      case "start":
        y = triggerRect.top + alignOffset;
        break;
      case "end":
        y = triggerRect.bottom - contentRect.height - alignOffset;
        break;
      case "center":
        y = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        break;
    }
  } else {
    // For top/bottom placement
    switch (align) {
      case "start":
        x = triggerRect.left + alignOffset;
        break;
      case "end":
        x = triggerRect.right - contentRect.width - alignOffset;
        break;
      case "center":
        x = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
    }
  }

  return { x, y };
}

export function calculatePosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  config: PositionConfig
): { position: Position; actualPlacement: Placement } {
  const { placement, align, sideOffset, alignOffset } = config;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Initial position based on placement
  let position: Position;
  let actualPlacement = placement;

  // Calculate initial position
  switch (placement) {
    case "bottom":
      position = {
        x: triggerRect.left,
        y: triggerRect.bottom + sideOffset,
      };
      break;
    case "top":
      position = {
        x: triggerRect.left,
        y: triggerRect.top - contentRect.height - sideOffset,
      };
      break;
    case "left":
      position = {
        x: triggerRect.left - contentRect.width - sideOffset,
        y: triggerRect.top,
      };
      break;
    case "right":
      position = {
        x: triggerRect.right + sideOffset,
        y: triggerRect.top,
      };
      break;
  }

  // Apply alignment
  position = calculateAlignmentOffset(
    position,
    triggerRect,
    contentRect,
    align,
    alignOffset,
    placement === "left" || placement === "right"
  );

  // Check for viewport overflow and flip if needed
  if (
    placement === "bottom" &&
    position.y + contentRect.height > viewportHeight - VIEWPORT_PADDING
  ) {
    actualPlacement = "top";
    position.y = triggerRect.top - contentRect.height - sideOffset;
  } else if (placement === "top" && position.y < VIEWPORT_PADDING) {
    actualPlacement = "bottom";
    position.y = triggerRect.bottom + sideOffset;
  } else if (
    placement === "right" &&
    position.x + contentRect.width > viewportWidth - VIEWPORT_PADDING
  ) {
    actualPlacement = "left";
    position.x = triggerRect.left - contentRect.width - sideOffset;
  } else if (placement === "left" && position.x < VIEWPORT_PADDING) {
    actualPlacement = "right";
    position.x = triggerRect.right + sideOffset;
  }

  // Ensure the popover stays within viewport bounds
  position.x = Math.max(
    VIEWPORT_PADDING,
    Math.min(position.x, viewportWidth - contentRect.width - VIEWPORT_PADDING)
  );
  position.y = Math.max(
    VIEWPORT_PADDING,
    Math.min(position.y, viewportHeight - contentRect.height - VIEWPORT_PADDING)
  );

  return { position, actualPlacement };
}
