// pages/posts/[slug].tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

interface FrontMatter {
  title: string;
  date: string;
  description: string;
}

interface PostPageProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatter;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDir = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDir);
  const paths = filenames.map((name) => ({
    params: { slug: name.replace(/\.mdx?$/, '') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  const slug = params!.slug as string;
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data as FrontMatter,
    },
  };
};

export default function PostPage({ source, frontMatter }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{`${frontMatter.title} | マイブログ`}</title>
        <meta name="description" content={frontMatter.description} />
      </Head>
      <main className="container">
        <article className="post-article">
          <h1 className="post-title">{frontMatter.title}</h1>
          <p className="post-date">{frontMatter.date}</p>
          <div className="post-content">
            <MDXRemote {...source} />
          </div>
        </article>
      </main>
    </>
  );
}
