/**
 * Date → YYYY-MM-DD 形式文字列に変換
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD 形式の文字列
 */
const pad = (n: number) => n.toString().padStart(2, '0');

export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};
