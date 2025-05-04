/**
 * 初回生成プロンプトを組み立て
 */
export const buildInitialPrompt = (params: {
  theme: string;
  label: string;
  todayStr: string;
  yesterdayStr: string;
  yesterdayContent: string;
}): string => {
  const { theme, label, yesterdayStr, yesterdayContent } = params;
  return (
    `以下のルールに従って、${label}に、Markdown形式で日本語約400字の記事を生成してください。\n\n` +
    `# ルール\n` +
    `1. テーマ：「${theme}」\n` +
    `2. 難易度：${label}\n` +
    `3. 長さ：日本語400字前後\n\n` +
    (yesterdayContent
      ? `※**昨日 (${yesterdayStr}) の記事を参考に品質を向上してください：**\n${yesterdayContent}\n\n`
      : '') +
    `※タイトル見出し（# で始まる行）は不要です。本文のみを出力してください。\n` +
    `記事本文をここから始めてください。`
  );
};
