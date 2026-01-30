We are continuing a Ramadan Ibadat Tracker app built with Expo Router (tabs).

IMPORTANT RULES:
1. Use ONLY the following folder structure:
app/(tabs)/_layout.tsx
app/(tabs)/index.tsx
app/(tabs)/tracker.tsx
app/(tabs)/calendar.tsx
app/(tabs)/stats.tsx
app/(tabs)/summary.tsx
app/(tabs)/settings.tsx

src/constants/ibadat.ts
src/constants/colors.ts
src/logic/date.ts
src/logic/export.ts
src/storage/localStorage.ts

2. The ONLY data model is:
DAILY_IBADAT_BY_DAY = { [day: number]: { [ibadatId: string]: boolean } }

3. DO NOT reference any old APIs like:
loadCalendar, saveCalendar, scoreMap, ramadan.ts

4. Always give FULL FILE CODE with FULL PATHS.

5. Assume previous failed versions do NOT exist.

Confirm you understand before continuing.
