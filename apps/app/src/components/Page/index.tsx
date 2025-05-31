import { Markdown } from '@nick8green/components';
// import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

const Components: { [key: string]: ReactNode } = {
  Markdown,
};

type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  slug: string[];
};

type PageStructure = {
  type: string;
  props?: object;
  children?: string;
};

const Page: FC<Readonly<PageProps>> = ({ params = {}, slug = [] }) => {
  const structure = [
    {
      type: 'Markdown',
      children: `Slug: ${slug.join('/')}

Params: ${JSON.stringify(params)}`,
    },
  ];

  // if (false) {
  //   return notFound();
  // }

  const render = (structure: PageStructure[]) => {
    return (structure ?? []).map((item: PageStructure, index: number) =>
      renderItem(item, `${item.type}-${index}`),
    );
  };

  const renderItem = (structure: PageStructure, key: string) => {
    const { type, props, children } = structure;
    const Component = Components[type] ?? Markdown;

    if (!Component) {
      console.error(`component "${type}" not found!`); // eslint-disable-line no-console
      throw new Error(`component "${type}" not found!`);
    }

    if (!children) {
      return <Component key={key} {...props} />;
    }

    return (
      <Component key={key} {...props}>
        {children ?? ''}
      </Component>
    );
  };

  return <>{render(structure as PageStructure[])}</>;
};

export default Page;
