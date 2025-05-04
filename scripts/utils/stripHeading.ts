/**
 * 先頭の H1 見出し行 (# …) を削除
 * @param text Markdown テキスト
 * @returns 見出しを除去したテキスト
 */
export const stripHeading = (text: string): string =>
  text.replace(/^#.*\\n+/, '').trim();
