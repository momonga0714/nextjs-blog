// pages/index.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Head from 'next/head';
import React from 'react';

import { Header } from '../components/Header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// 英語キーを日本語ラベルにマッピング
const difficultyLabels: Record<Difficulty, string> = {
  beginner: '初級者',
  intermediate: '中級者',
  advanced: '上級者',
};

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  difficulty: Difficulty;
}

interface HomeProps {
  beginnerPosts: PostMeta[];
  intermediatePosts: PostMeta[];
  advancedPosts: PostMeta[];
}

export const getStaticProps = async () => {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const beginnerPosts: PostMeta[] = [];
  const intermediatePosts: PostMeta[] = [];
  const advancedPosts: PostMeta[] = [];

  for (const fileName of files) {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);

    const level = slug.split('-').pop() as Difficulty;
    const post: PostMeta = {
      slug,
      title: data.title as string,
      date: data.date as string,
      difficulty: level,
    };

    if (level === 'beginner') beginnerPosts.push(post);
    else if (level === 'intermediate') intermediatePosts.push(post);
    else if (level === 'advanced') advancedPosts.push(post);
  }

  const sortByDateDesc = (a: PostMeta, b: PostMeta) =>
    a.date < b.date ? 1 : -1;

  return {
    props: {
      beginnerPosts: beginnerPosts.sort(sortByDateDesc),
      intermediatePosts: intermediatePosts.sort(sortByDateDesc),
      advancedPosts: advancedPosts.sort(sortByDateDesc),
    },
  };
};

export default function Home({
  beginnerPosts,
  intermediatePosts,
  advancedPosts,
}: HomeProps) {
  const renderSection = (posts: PostMeta[]) => {
    if (posts.length === 0) return null;
    const label = difficultyLabels[posts[0].difficulty];
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold border-l-4 border-accent pl-2 mb-6">
          {label}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(({ slug, title, date }) => (
            <Link key={slug} href={`/posts/${slug}`} className="block">
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {date}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <Head>
        <title>マイブログ</title>
        <meta name="description" content="記事一覧" />
      </Head>
      {/* ヘッダー */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded">
          Tailwind が効いていればこのボックスは赤くなります
        </div>
        {renderSection(beginnerPosts)}
        {renderSection(intermediatePosts)}
        {renderSection(advancedPosts)}
      </main>
    </>
  );
}
