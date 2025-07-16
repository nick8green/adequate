import Renderer, { PageElement } from '@shared/components/renderer';
import { getPage } from '@shared/data';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  slug: string[];
};

const Page: FC<Readonly<PageProps>> = async ({ params = {}, slug = [] }) => {
  let structure: PageElement[] = [];
  try {
    structure = await getPage(slug, params);
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      return notFound();
    }
    throw error;
  }

  return <Renderer structure={structure} />;
};

export default Page;
