import { ISLAMIC_LIBRARY, IslamicContent } from "./islamicData";

function pickRandom(arr: IslamicContent[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getAIReply(userMessage: string): string {
  const text = userMessage.toLowerCase();
  let bucket: IslamicContent[];

  if (text.includes("miss") || text.includes("gunah") || text.includes("fail")) {
    bucket = ISLAMIC_LIBRARY.missed;
  } else if (text.includes("tired") || text.includes("lazy") || text.includes("thak")) {
    bucket = ISLAMIC_LIBRARY.tired;
  } else if (text.includes("dua")) {
    bucket = ISLAMIC_LIBRARY.dua;
  } else {
    bucket = ISLAMIC_LIBRARY.default;
  }

  const content = pickRandom(bucket);

  let reply = "";

  if (content.ayah) {
    reply += `${content.ayah.arabic}\n\n`;
    reply += `“${content.ayah.meaning}”\n`;
    reply += `(${content.ayah.ref})\n\n`;
  }

  if (content.hadith) {
    reply += `${content.hadith.text}\n`;
    reply += `(${content.hadith.ref})\n\n`;
  }

  reply += content.tafseer;

  return reply;
}
