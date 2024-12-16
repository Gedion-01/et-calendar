import { createContext, useContext } from "react";

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

export const PopoverContext = createContext<PopoverContextType | undefined>(
  undefined
);

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
}
