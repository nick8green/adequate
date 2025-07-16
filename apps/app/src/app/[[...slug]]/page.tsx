import Page from '@app/components/Page';
import { reportToPrometheus as httpRequestCount } from '@shared/metrics/httpRequestCount';
import { Metadata /*, ResolvingMetadata*/ } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata
export const generateMetadata = async () // { params, searchParams }: Props,
// parent: ResolvingMetadata,
: Promise<Metadata> => {
  return {
    title: 'Adequate',
    description: 'Basic framework for building a web application',
  };
};

// This is a server component, so it can use async/await.
// It is also used to fetch data from the server.
// It is used to fetch data from the server.

const PageRoute = async ({ params, searchParams }: Readonly<Props>) => {
  const { slug } = await params;

  httpRequestCount({
    method: 'GET',
    route: `/${slug?.join('/')}`,
    statusCode: '200',
  });

  return <Page slug={slug} params={await searchParams} />;
};

export default PageRoute;
