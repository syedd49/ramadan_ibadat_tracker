import { NAMAZ_TASBEEH_MAP, Namaz } from "./namazTasbeehMap";

export function getTasbeehSuggestion(
  namaz: Namaz
): string {
  const data = NAMAZ_TASBEEH_MAP[namaz];

  return (
    `🕌 ${capitalize(namaz)} ke baad tasbeeh:\n\n` +
    `📿 ${data.tasbeeh}\n\n` +
    `💡 ${data.reason}`
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
