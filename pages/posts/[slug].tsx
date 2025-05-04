import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
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
    // .md または .mdx 拡張子を正しく削除
    params: { slug: name.replace(/\.mdx?$/, '') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  if (!params?.slug || Array.isArray(params.slug)) {
    return { notFound: true };
  }
  const slug = params.slug as string;
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
  } as GetStaticPropsResult<PostPageProps>;
};

export default function PostPage({ source, frontMatter }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        <meta name="description" content={frontMatter.description} />
      </Head>
      <article className="prose mx-auto py-8">
        <h1>{frontMatter.title}</h1>
        <p>
          <small>{frontMatter.date}</small>
        </p>
        <MDXRemote {...source} />
      </article>
    </>
  );
}
