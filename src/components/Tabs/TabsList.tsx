import React from "react";

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={`tabs-list ${className || ""}`}>{children}</div>;
}
