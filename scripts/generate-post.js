// scripts/generate-post.js
import dotenv from 'dotenv';
// .env.local を読み込む
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// 日替わりテーマ
const themes = [
  '投資信託の積立について',
  '個別株投資について',
  '外貨投資について',
  'FXのスワップ投資について',
  '投資の税金について',
];
const today = new Date();
const date = today.toISOString().slice(0, 10);
const theme = themes[today.getDate() % themes.length];

// モデルは環境変数で切り替え（デフォルトは gpt-3.5-turbo）
const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEYが設定されていません。');
  process.exit(1);
}

// OpenAI v4 の新クライアントをインスタンス化
const openai = new OpenAI({ apiKey });

async function main() {
  const filename = path.join('posts', `${date}-auto.md`);

  // プロンプトを組み立て
  const prompt =
    `以下のルールに従って、Markdown形式で日本語約400字の記事を生成してください。\n\n` +
    `# ルール\n` +
    `1. テーマ：『${theme}』\n` +
    `2. 構成：必ず以下の見出しを含む\n` +
    `   - ## 初心者向けポイント\n` +
    `   - ## 中級者向けポイント\n` +
    `   - ## 上級者向けポイント\n` +
    `3. 長さ：全体で日本語400字前後\n` +
    `4. 記事冒頭にFront Matterを入れる：\n` +
    `---\n` +
    `title: "${theme}（${date}）"\n` +
    `date: "${date}"\n` +
    `description: "投資に関する自動生成記事サンプル"\n` +
    `---\n\n` +
    `記事本文をここから始めてください。`;

  // AI生成を実行
  const response = await openai.chat.completions.create({
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

  const body = response.choices[0].message.content.trim();

  // Front Matter を付与してファイルに書き込む
  const frontMatter = `---\ntitle: "${theme}（${date}）"\ndate: "${date}"\ndescription: "投資に関する自動生成記事サンプル"\n---\n\n`;
  fs.writeFileSync(filename, frontMatter + body + '\n', 'utf8');
  console.log(`✅ ${filename} を作成しました`);

  // Git 操作で自動コミット＆プッシュ
  const { execSync } = await import('child_process');
  try {
    execSync('git add posts', { stdio: 'inherit' });
    execSync(`git commit -m "chore: add auto-generated post for ${date}"`, {
      stdio: 'inherit',
    });
    execSync('git push origin master', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Git 操作でエラーが発生しました:', error);
  }
}

main().catch((err) => {
  console.error('スクリプト実行中にエラーが発生しました:', err);
  process.exit(1);
});
