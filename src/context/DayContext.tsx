
import React, {
  createContext,
  useContext,
  useState,
} from "react";

type DayContextType = {
  day: number;
  today: number;
  nextDay: () => void;
  prevDay: () => void;
  setDayByCalendar: (day: number) => void;
  isPastDay: boolean;
  isFutureDay: boolean;
};

const DayContext = createContext<DayContextType | null>(
  null
);

export function DayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 today = system date (4 Feb → 4)
  const today = new Date().getDate();

  const [day, setDay] = useState<number>(today);

  /* -----------------------------
     STEP 2: LOCK FUTURE DAYS
  --------------------------------*/
  const nextDay = () => {
    // ❌ future lock
    if (day >= today) return;
    setDay(d => d + 1);
  };

  /* -----------------------------
     STEP 3: ALLOW PAST VIEW ONLY
  --------------------------------*/
  const prevDay = () => {
    setDay(d => Math.max(d - 1, 1));
  };

  const setDayByCalendar = (selectedDay: number) => {
    // calendar bhi future day select nahi kar sakta
    if (selectedDay > today) return;
    setDay(selectedDay);
  };

  const isPastDay = day < today;
  const isFutureDay = day > today;

  return (
    <DayContext.Provider
      value={{
        day,
        today,
        nextDay,
        prevDay,
        setDayByCalendar,
        isPastDay,
        isFutureDay,
      }}
    >
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const ctx = useContext(DayContext);
  if (!ctx) {
    throw new Error(
      "useDay must be used inside DayProvider"
    );
  }
  return ctx;
}
