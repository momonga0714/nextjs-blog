// 日替わりテーマ一覧
const themes: string[] = [
  '投資信託の積立について',
  '個別株投資について',
  '外貨投資について',
  'FXのスワップ投資について',
  '投資の税金について',
];

/**
 * 日付からテーマを取得（1日→themes[0], 2日→themes[1], …）
 * @param date Date オブジェクト
 * @returns テーマ文字列
 */
export const getTheme = (date: Date): string =>
  themes[(date.getDate() - 1) % themes.length];
