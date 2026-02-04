import { SALAH_LIST, IBADAT_LIST } from "../constants/ibadat";

export function generateDailyFocus({
  mostMissed,
}: {
  mostMissed: string | null;
}) {
  if (mostMissed) {
    const salah = SALAH_LIST.find(s => s.id === mostMissed);
    return `🤲 Aaj ka focus: ${salah?.title}\n\nAllah se dua karein ke aaj yeh salah waqt pe ada ho.`;
  }

  return `✨ Aaj ka focus: Zikr aur Shukr\n\n100 martaba SubhanAllah padhne ka target rakhein.`;
}
