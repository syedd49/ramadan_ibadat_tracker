import { en } from "./en";
import { ur } from "./ur";

export const languages = {
  en,
  ur,
};

export type LanguageKey = keyof typeof languages;
