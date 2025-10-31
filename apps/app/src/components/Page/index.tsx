import Renderer, { PageElement } from '@shared/components/renderer';

export type PageProps = {
  params?: { [key: string]: string | string[] | undefined };
  slug: string[];
  structure: PageElement[];
};

const Page = async ({
  structure = [],
}: Readonly<PageProps>): Promise<React.ReactElement | null> => {
  return <Renderer structure={structure} />;
};

export default Page;
