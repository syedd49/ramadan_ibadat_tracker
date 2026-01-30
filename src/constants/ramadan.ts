export type RamadanDay = {
  day: number;
  completed: boolean;
};

export const createRamadanDays = (): RamadanDay[] =>
  Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    completed: false,
  }));
