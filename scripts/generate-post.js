// scripts/generate-post.js
import dotenv from 'dotenv';
// .env.local を読み込む
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// 日替わりテーマ一覧
const themes = [
  '投資信託の積立について',
  '個別株投資について',
  '外貨投資について',
  'FXのスワップ投資について',
  '投資の税金について',
];

// 難易度レベルと日本語ラベル
const levels = ['beginner', 'intermediate', 'advanced'];
const levelLabels = {
  beginner: '初心者向け',
  intermediate: '中級者向け',
  advanced: '上級者向け',
};

// 日付と今日のテーマ（1日→themes[0], 2日→themes[1], …）
const today = new Date();
const date = today.toISOString().slice(0, 10);
const theme = themes[(today.getDate() - 1) % themes.length];

// OpenAI クライアント設定
const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEYが設定されていません。');
  process.exit(1);
}
const openai = new OpenAI({ apiKey });

async function generateForLevel(level) {
  const label = levelLabels[level];

  // ── 追加部分：昨日の記事を探す ──
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().slice(0, 10);
  const yTheme = themes[(yesterday.getDate() - 1) % themes.length];
  const yFilename = path.join(
    'posts',
    `${yTheme.replace(/[^a-zA-Z0-9]/g, '-')}-${level}.md`
  );
  let yesterdayContent = '';
  if (fs.existsSync(yFilename)) {
    yesterdayContent = fs.readFileSync(yFilename, 'utf8');
  }
  // ─────────────────────────────────

  const filename = path.join(
    'posts',
    `${theme.replace(/[^a-zA-Z0-9]/g, '-')}-${level}.md`
  );
  let body;

  if (!fs.existsSync(filename)) {
    // 初回生成プロンプトに昨日の記事を追加
    const prompt =
      `以下のルールに従って、${label}に、Markdown形式で日本語約400字の記事を生成してください。\n\n` +
      `# ルール\n` +
      `1. テーマ：「${theme}」\n` +
      `2. 難易度：${label}\n` +
      `3. 長さ：日本語400字前後\n\n` +
      `※**昨日 (${yDate}) の記事を参考に品質を向上してください：**\n` +
      `${yesterdayContent}\n\n` +
      `※タイトル見出し（# で始まる行）は不要です。本文のみを出力してください。\n` +
      `記事本文をここから始めてください。`;

    const res = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'あなたは有益な投資ブログ記事のライターです。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    body = res.choices[0].message.content.trim().replace(/^#.*\n+/, '');
  } else {
    // 深掘りプロンプトにも昨日の記事を追加
    const previous = fs.readFileSync(filename, 'utf8');
    const deepenPrompt =
      `以下のMarkdown記事を読み込み、具体例や詳細を追加して内容をさらに深掘りしてください。\n\n` +
      `※**昨日 (${yDate}) の記事を参考に品質を向上してください：**\n` +
      `${yesterdayContent}\n\n` +
      `※先頭見出し（# …）は残さず、本文部分のみで更新してください。\n\n` +
      previous;

    const res2 = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: '記事の品質を向上させるプロの編集者です。' },
        { role: 'user', content: deepenPrompt },
      ],
      temperature: 0.7,
    });

    body = res2.choices[0].message.content.trim().replace(/^#.*\n+/, '');
  }

  // Front Matter を付与（タイトルにラベルは含めず、difficulty のみメタ情報として残す）
  const frontMatter =
    `---\n` +
    `title: "${theme}（${date})"\n` +
    `date: "${date}"\n` +
    `difficulty: "${level}"\n` +
    `---\n\n`;

  fs.writeFileSync(filename, frontMatter + body + '\n', 'utf8');
  console.log(`✅ ${filename} を生成/更新しました`);
  return filename;
}

async function main() {
  for (const level of levels) {
    try {
      await generateForLevel(level);
    } catch (err) {
      console.error(`Error generating ${level}:`, err);
    }
  }

  // Git コミット & プッシュ
}

main().catch((err) => {
  console.error('スクリプト実行中にエラー:', err);
  process.exit(1);
});
