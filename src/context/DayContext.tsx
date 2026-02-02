import { createContext, useContext, useState } from "react";

type DayContextType = {
  day: number;
  setDay: (d: number) => void;
  nextDay: () => void;
  prevDay: () => void;
};

const DayContext = createContext<DayContextType | null>(null);

export function DayProvider({ children }: { children: any }) {
  const [day, setDay] = useState<number>(1);

  const nextDay = () => setDay(d => d + 1);
  const prevDay = () => setDay(d => (d > 1 ? d - 1 : 1));

  return (
    <DayContext.Provider value={{ day, setDay, nextDay, prevDay }}>
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const ctx = useContext(DayContext);
  if (!ctx) throw new Error("useDay must be used inside DayProvider");
  return ctx;
}
