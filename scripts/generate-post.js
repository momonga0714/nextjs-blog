import dotenv from 'dotenv';
// .env.local を読み込む
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

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
  // 日付と出力ファイル名を生成
  const date = new Date().toISOString().slice(0, 10);
  const filename = path.join('posts', `${date}-auto.md`);

  // AIに記事本文を生成
  const prompt = `次の記事をMarkdown形式で生成してください：
タイトル: 'Next.js × GitHub Pages で始める静的サイト'
概要: 'Next.js と GitHub Actions を使って完全自動デプロイされた静的ブログを作成する手順'`;

  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [
      { role: 'system', content: 'あなたは技術ブログのライターです。' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const body = response.choices[0].message.content.trim();

  // Front Matter を付与
  const frontMatter = `---
title: "自動生成記事 ${date}"
date: "${date}"
description: "生成AIによる自動投稿サンプル"
---

`;

  // Markdown ファイルとして保存
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
    console.warn('Git 操作でエラーが発生しましたが続行します。', error);
  }
}

main().catch((err) => {
  console.error('スクリプト実行中にエラーが発生しました:', err);
  process.exit(1);
});
