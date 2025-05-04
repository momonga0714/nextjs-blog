/**
 * Date → YYYY-MM-DD 形式文字列に変換
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD 形式の文字列
 */
export const formatDate = (date: Date): string =>
  date.toISOString().slice(0, 10);
