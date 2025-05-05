// scripts/generate-post.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

import { formatDate } from './utils/formatDate';
import { getTheme } from './utils/getTheme';
import { getJSTDate } from './utils/getJSTDate';
import { loadArticleContent } from './utils/loadArticleContent';
import { stripHeading } from './utils/stripHeading';
import { buildFrontMatter } from './utils/buildFrontMatter';
import { buildInitialPrompt } from './utils/buildInitialPrompt';
import { buildDeepenPrompt } from './utils/buildDeepenPrompt';

type LevelKey = 'beginner' | 'intermediate' | 'advanced';
interface Level {
  key: LevelKey;
  label: string;
}

// 難易度ごとに key と label を一つの配列で管理
const levels: Level[] = [
  { key: 'beginner', label: '初心者向け' },
  { key: 'intermediate', label: '中級者向け' },
  { key: 'advanced', label: '上級者向け' },
];

// OpenAI クライアント設定
const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY が設定されていません。');
  process.exit(1);
}
const openai = new OpenAI({ apiKey });

const generateForLevel = async (level: LevelKey, label: string): Promise<void> => {
  const today = getJSTDate();
  const todayStr = formatDate(today);
  const theme = getTheme(today);

  // 昨日の記事を読み込む
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);
  const yesterdayTheme = getTheme(yesterday);
  const yesterdayContent = stripHeading(
    loadArticleContent(yesterdayStr, yesterdayTheme, level)
  );

  const filename = path.join(
    'posts',
    `${theme.replace(/[^a-zA-Z0-9]/g, '-')}-${level}.md`
  );
  let body: string;
  if (!fs.existsSync(filename)) {
    const prompt = buildInitialPrompt({
      theme,
      label,
      todayStr,
      yesterdayStr,
      yesterdayContent,
    });
    const res = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'あなたは有益な投資ブログ記事のライターです。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = res.choices?.[0]?.message.content ?? '';
    body = stripHeading(content);
  } else {
    const previousContent = fs.readFileSync(filename, 'utf8');
    const deepenPrompt = buildDeepenPrompt({
      previousContent,
      yesterdayStr,
      yesterdayContent,
    });
    const res2 = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: '記事の品質を向上させるプロの編集者です。' },
        { role: 'user', content: deepenPrompt },
      ],
      temperature: 0.7,
    });
    body = stripHeading(res2.choices[0].message?.content ?? '');
  }

  const frontMatter = buildFrontMatter({ theme, dateStr: todayStr, level });
  fs.writeFileSync(filename, frontMatter + body + '\n', 'utf8');
  console.log(`✅ ${filename} を生成/更新しました`);
}

(async () => {
  for (const { key: level, label } of levels) {
    try {
      await generateForLevel(level, label);
    } catch (err) {
      console.error(`Error generating ${level}:`, err);
    }
  }
})();
