import fs from 'fs';
import path from 'path';

/**
 * 指定日・テーマ・レベルの記事内容を読み込む
 * @param dateStr YYYY-MM-DD 形式の日付文字列
 * @param theme テーマ文字列
 * @param level 難易度レベルキー
 * @returns 記事の Markdown 内容、存在しなければ空文字
 */
export const loadArticleContent = (
  dateStr: string,
  theme: string,
  level: string
): string => {
  const filename = path.join(
    'posts',
    `${theme.replace(/[^a-zA-Z0-9]/g, '-')}-${level}.md`
  );
  return fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : '';
};
