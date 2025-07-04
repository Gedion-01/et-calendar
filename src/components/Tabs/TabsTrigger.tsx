import React from "react";
import { useTabs } from "./TabsContext";

interface TabsTriggerProps {
  value: "ethiopian" | "gregorian";
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      type="button"
      className={`tabs-trigger ${className || ""} ${
        activeTab === value ? "active" : ""
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}
