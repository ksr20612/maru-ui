import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

function normalizeSlug(slug: string[] | undefined): string[] {
  /** `/docs` — optional catch-all with no segments → root `index.mdx` (slug `[]`). */
  if (slug != null && slug.length > 0) return slug;
  return [];
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(normalizeSlug(slug));
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const generated = await source.generateParams();
  const hasDocsRoot = generated.some(
    (p) => p.slug === undefined || (Array.isArray(p.slug) && p.slug.length === 0),
  );
  return hasDocsRoot ? generated : [{ slug: undefined }, ...generated];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(normalizeSlug(slug));
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
