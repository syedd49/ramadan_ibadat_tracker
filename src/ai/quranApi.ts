// /RAMADAN-IBADAT_TRACKER/src/ai/quranApi.ts

type VerseAPIResponse = {
  verses: {
    text_uthmani: string;
    verse_key: string;
  }[];
};

const BASE_URL = "https://api.quran.com/api/v4";

/**
 * REAL Quran API (safe)
 */
export async function fetchQuranAyahFromAPI(
  ayahKey: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/verses/by_key/${ayahKey}?words=false`
    );

    const json: VerseAPIResponse = await res.json();
    const verse = json.verses?.[0];

    if (!verse?.text_uthmani) return null;

    return (
      `${verse.text_uthmani}\n\n📖 Quran ${verse.verse_key}`
    );
  } catch {
    return null;
  }
}
