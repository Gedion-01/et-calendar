import React from "react";
import { useTabs } from "./TabsContext";

interface TabsContentProps {
  value: "ethiopian" | "gregorian";
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab } = useTabs();

  return activeTab === value ? (
    <div className={`tabs-content ${className || ""}`}>{children}</div>
  ) : null;
}
