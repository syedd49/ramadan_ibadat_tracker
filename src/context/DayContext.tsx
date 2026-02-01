import { createContext, useContext, useState, ReactNode } from "react";
import { Stack } from "expo-router";

type DayContextType = {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
};

const DayContext = createContext<DayContextType | null>(null);

export function DayProvider({ children }: { children: ReactNode }) {
  const [selectedDay, setSelectedDay] = useState(1);

  

  return (
    <DayContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error("useDay must be used inside DayProvider");
  }
  return context;
}
