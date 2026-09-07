/**
 * Marks a phrase for editorial italic without changing the visible sentence.
 * Used only with compile-time copy; never with user input.
 */
export function emphasize(text: string, phrase: string): string {
  const index = text.indexOf(phrase);
  if (index === -1) {
    return text;
  }

  return `${text.slice(0, index)}<em>${phrase}</em>${text.slice(index + phrase.length)}`;
}
