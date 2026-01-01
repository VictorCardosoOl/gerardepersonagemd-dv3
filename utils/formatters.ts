import { DICTIONARY } from "../constants";

export const translateTerm = (term: string): string => {
  if (!term) return "";
  if (DICTIONARY[term]) return DICTIONARY[term];
  const lower = term.toLowerCase();
  if (DICTIONARY[lower]) return DICTIONARY[lower];
  const clean = lower.replace(/[,.]/g, '');
  if (DICTIONARY[clean]) return DICTIONARY[clean];
  return term;
};

export const translateText = (text: string): string => {
  if (!text) return "";
  const parts = text.split(', ');
  const translated = parts.map(p => translateTerm(p.trim()));
  return translated.join(', ');
};