/**
 * 深掘り生成プロンプトを組み立て
 */
export const buildDeepenPrompt = (params: {
  previousContent: string;
  yesterdayStr: string;
  yesterdayContent: string;
}): string => {
  const { previousContent, yesterdayStr, yesterdayContent } = params;
  return `以下のMarkdown記事を読み込み、具体例や詳細を追加して内容をさらに深掘りしてください。\n\n` +
    (yesterdayContent
      ? `※**昨日 (${yesterdayStr}) の記事を参考に品質を向上してください：**\n${yesterdayContent}\n\n`
      : '') +
    `※先頭見出し（# …）は残さず、本文部分のみで更新してください。\n\n` +
    previousContent;
};
