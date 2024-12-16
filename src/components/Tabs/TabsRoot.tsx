import React from "react";
import { TabsProvider } from "./TabsContext";

interface TabsRootProps {
  children: React.ReactNode;
  initialActiveTab: "ethiopian" | "gregorian";
}

export function TabsRoot({ children, initialActiveTab }: TabsRootProps) {
  return (
    <TabsProvider initialActiveTab={initialActiveTab}>{children}</TabsProvider>
  );
}
