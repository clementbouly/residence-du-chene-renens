export const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export function matchesSearchText(content: string, search: string) {
  const searchableText = normalizeSearchText(content);
  const queryTokens = normalizeSearchText(search).split(" ").filter(Boolean);

  return queryTokens.every((token) => searchableText.includes(token));
}
