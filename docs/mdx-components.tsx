import { PickerViewBasicDemo } from '@/content/docs/react/components/picker-view-basic-demo';
import { PickerViewCustomRenderDemo } from '@/content/docs/react/components/picker-view-custom-render-demo';
import { PickerViewProgrammaticScrollDemo } from '@/content/docs/react/components/picker-view-programmatic-scroll-demo';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    PickerViewBasicDemo,
    PickerViewCustomRenderDemo,
    PickerViewProgrammaticScrollDemo,
    ...components,
  };
}
