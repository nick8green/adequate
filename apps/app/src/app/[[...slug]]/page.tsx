import { getPageData } from '@app/actions/page';
import type { PageProps } from '@app/components/Page';
import Page from '@app/components/Page';
import type { Page as PageData } from '@content/graph/generated/types';
import { PageElement } from '@shared/components/renderer';
import { reportToPrometheus as httpRequestCount } from '@shared/metrics/httpRequestCount';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata
export const generateMetadata = async (
  { params }: Readonly<Props>,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { slug } = await params;
  const data = await getPageData(slug?.join('/') ?? '');

  console.debug('generateMetadata parent:', await parent); // eslint-disable-line no-console

  return {
    title: data.meta.title ?? 'N8G Adequate',
    description:
      data.meta.description ?? 'Basic framework for building a web application',
    openGraph: {
      title: data.meta.title ?? 'N8G Adequate',
      description:
        data.meta.description ??
        'Basic framework for building a web application',
    },
  };
};

// This is a server component, so it can use async/await.
// It is also used to fetch data from the server.
// It is used to fetch data from the server.

const PageRoute: FC<Props> = async ({
  params,
  searchParams,
}: Readonly<Props>) => {
  const { slug } = await params;
  const sp = await searchParams;

  httpRequestCount({
    method: 'GET',
    route: `/${slug?.join('/')}`,
    statusCode: '200',
  });

  let data: PageData;
  try {
    data = await getPageData(slug?.join('/') ?? '');

    if (!data) {
      return notFound();
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      return notFound();
    }
    throw error;
  }

  let PageType;
  // @ts-expect-error as this is a dynamic assignment depending on the page type
  let args: PageProps = {
    params: sp,
    slug,
  };

  switch (data.type) {
    case 'BLOG':
      throw new Error('blog pages not implemented yet!');
    case 'PAGE':
      PageType = Page;
      args = { ...args, structure: data.structure ?? [] } as object & {
        structure: PageElement[];
      } as PageProps;
      break;
    default:
      throw new Error(`unknown page type: ${data.type}`);
  }

  return <PageType {...args} />;
};

export default PageRoute;
