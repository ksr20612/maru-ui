import { docs } from 'fumadocs-mdx:collections/server';
import type { InferPageType } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type PageType = InferPageType<typeof source>;
