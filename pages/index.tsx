// pages/index.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Head from 'next/head';

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface HomeProps {
  beginnerPosts: PostMeta[];
  intermediatePosts: PostMeta[];
  advancedPosts: PostMeta[];
}

export const getStaticProps = async () => {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const beginner: PostMeta[] = [];
  const intermediate: PostMeta[] = [];
  const advanced: PostMeta[] = [];

  files.forEach((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    const post: PostMeta = {
      slug,
      title: data.title as string,
      date: data.date as string,
      difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
    };
    if (post.difficulty === 'beginner') beginner.push(post);
    else if (post.difficulty === 'intermediate') intermediate.push(post);
    else if (post.difficulty === 'advanced') advanced.push(post);
  });

  return {
    props: {
      beginnerPosts: beginner,
      intermediatePosts: intermediate,
      advancedPosts: advanced,
    },
  };
};

export default function Home({
  beginnerPosts,
  intermediatePosts,
  advancedPosts,
}: HomeProps) {
  const renderSection = (label: string, posts: PostMeta[]) => (
    <section style={{ marginBottom: '2rem' }}>
      <h2>{label}</h2>
      <ul>
        {posts.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`}>{title}</Link> <small>({date})</small>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <>
      <Head>
        <title>マイブログ</title>
        <meta name="description" content="難易度別投稿一覧" />
      </Head>
      <main className="container">
        <h1>難易度別投稿一覧</h1>
        {renderSection('■ 初心者向け投稿一覧', beginnerPosts)}
        {renderSection('■ 中級者向け投稿一覧', intermediatePosts)}
        {renderSection('■ 上級者向け投稿一覧', advancedPosts)}
      </main>
    </>
  );
}
