import React, { createContext, useContext, useState } from "react";

interface TabsContextProps {
  activeTab: "ethiopian" | "gregorian";
  setActiveTab: (value: "ethiopian" | "gregorian") => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function TabsProvider({
  children,
  initialActiveTab,
}: {
  children: React.ReactNode;
  initialActiveTab: "ethiopian" | "gregorian";
}) {
  const [activeTab, setActiveTab] = useState<"ethiopian" | "gregorian">(
    initialActiveTab
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};
