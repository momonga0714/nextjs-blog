// pages/index.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Head from 'next/head';

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

    // slug の末尾にくっつけたレベル文字列から難易度を取得
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

  // 日付降順にソート
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
      <section style={{ marginBottom: '2rem' }}>
        <h2>{label}</h2>
        <ul>
          {posts.map(({ slug, title, date }) => (
            <li key={slug} style={{ marginBottom: '0.5rem' }}>
              <Link href={`/posts/${slug}`}>{title}</Link>{' '}
              <small>({date})</small>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <>
      <Head>
        <title>マイブログ</title>
        <meta name="description" content="記事一覧" />
      </Head>
      <main className="container">
        <h1>記事一覧</h1>
        {renderSection(beginnerPosts)}
        {renderSection(intermediatePosts)}
        {renderSection(advancedPosts)}
      </main>
    </>
  );
}
