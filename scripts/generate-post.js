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

// 日付と今日のテーマ
const today = new Date();
const date = today.toISOString().slice(0, 10);
const theme = themes[today.getDate() % themes.length];

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
  // ファイル名をテーマベースに変更
  const filename = path.join(
    'posts',
    `${theme.replace(/[^a-zA-Z0-9]/g, '-')}-${level}.md`
  );
  let body;

  // 初回生成 or 深掘り
  if (!fs.existsSync(filename)) {
    // テーマと難易度に応じたプロンプト
    const prompt =
      `以下のルールに従って、${label}に、Markdown形式で日本語約400字の記事を生成してください。\n\n` +
      `# ルール\n` +
      `1. テーマ：「${theme}」\n` +
      `2. 難易度：${label}\n` +
      `3. 長さ：日本語400字前後\n` +
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
    body = res.choices[0].message.content.trim();
  } else {
    // 深掘りプロンプト
    const previous = fs.readFileSync(filename, 'utf8');
    const deepenPrompt = `以下のMarkdown記事を読み込み、具体例や詳細を追加して内容をさらに深掘りしてください。記事全体を更新してください。\n\n${previous}`;
    const res2 = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: '記事の品質を向上させるプロの編集者です。' },
        { role: 'user', content: deepenPrompt },
      ],
      temperature: 0.7,
    });
    body = res2.choices[0].message.content.trim();
  }

  // Front Matter を付与
  const frontMatter =
    `---\n` +
    `title: "${theme}（${date}） - ${label}"\n` +
    `date: "${date}"\n` +
    `description: "${theme} の自動生成記事 (${label})"\n` +
    `difficulty: "${level}"\n` +
    `---\n\n`;

  // Markdown ファイルを更新
  fs.writeFileSync(filename, frontMatter + body + '\n', 'utf8');
  console.log(`✅ ${filename} を生成/更新しました`);
  return filename;
}

async function main() {
  // 全難易度を順に処理
  for (const level of levels) {
    try {
      await generateForLevel(level);
    } catch (err) {
      console.error(`Error generating ${level}:`, err);
    }
  }

  // Git コミット & プッシュ
  const { execSync } = await import('child_process');
  try {
    execSync('git add posts', { stdio: 'inherit' });
    execSync(`git commit -m \"chore: auto-gen posts for ${date}\"`, {
      stdio: 'inherit',
    });
    execSync('git push origin master', { stdio: 'inherit' });
  } catch {
    // コミットなしでも続行
  }
}

main().catch((err) => {
  console.error('スクリプト実行中にエラー:', err);
  process.exit(1);
});
