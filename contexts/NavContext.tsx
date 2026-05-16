import React, { createContext, useContext, useState } from "react";

export type NavData = {
  planId: string;
  returnId: string;
  returnTo: string;
  planName: string;
  planDifficulty: string;
  planDuration: string;
};

type NavContextType = {
  navData: NavData | null;
  setNavData: (d: NavData | null) => void;
};

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [navData, setNavData] = useState<NavData | null>(null);

  const value = React.useMemo(() => ({ navData, setNavData }), [navData]);

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("NavProvider is missing");
  return ctx;
}
