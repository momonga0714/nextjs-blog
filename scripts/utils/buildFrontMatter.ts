/**
 * FrontMatter 部分を生成
 * @param params テーマ・日付・レベル情報
 * @returns YAML FrontMatter 文字列
 */
export const buildFrontMatter = (params: {
  theme: string;
  dateStr: string;
  level: string;
}): string => {
  const { theme, dateStr, level } = params;
  return (
    `---\n` +
    `title: "${theme}（${dateStr}）"\n` +
    `date: "${dateStr}"\n` +
    `difficulty: "${level}"\n` +
    `---\n\n`
  );
};
