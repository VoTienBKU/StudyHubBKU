export function normalizeText(s: string = ""): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
