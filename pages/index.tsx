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
}

interface HomeProps {
  posts: PostMeta[];
}

export const getStaticProps = async () => {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const posts: PostMeta[] = files
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return { props: { posts } };
};

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Head>
        <title>マイブログ</title>
        <meta name="description" content="Next.js × GitHub Pages のブログ" />
      </Head>
      <main className="container">
        <header>
          <h1>ブログ記事一覧</h1>
          <p>私のブログへようこそ！最新の投稿をご覧ください。</p>
        </header>
        <ul className="post-list">
          {posts.map(({ slug, title, date }) => (
            <li key={slug}>
              <Link href={`/posts/${slug}`}>{title}</Link>
              <span className="date">{date}</span>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
