import { BlogList, Markdown, Timeline } from '@nick8green/components';
import { Banner } from '@shared/components/banner';
import { FC, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Components: { [key: string]: ReactNode | FC<any> } = {
  Banner,
  BlogList,
  MD: Markdown,
  Timeline,
};

type RendererProps = {
  structure: PageElement[];
};

export type PageElement = {
  type?: string;
  content?: string;
} & {
  [key: string]: boolean | number | string;
};

const Renderer: FC<Readonly<RendererProps>> = ({ structure }) => {
  const render = (structure: PageElement, key: string) => {
    const { type, content } = structure;
    const props = { ...structure };
    delete props.type;
    delete props.content;
    const Component = type ? Components[type] : Markdown;

    if (!Component || !type) {
      console.error(`component "${type}" not found!`); // eslint-disable-line no-console
      throw new Error(`component "${type}" not found!`);
    }

    if (!content) {
      return <Component key={key} {...transformProps(type, props)} />;
    }

    return (
      <Component key={key} {...transformProps(type, props)}>
        {content}
      </Component>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformProps = (type: string, props: any): any => {
    if (type === 'Timeline') {
      props.order = props.order ? props.order.toLowerCase() : 'asc';
      return {
        ...props,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: props.items.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        })),
      };
    }
    return props;
  };

  return (
    <>
      {structure.map((item: PageElement, index: number) =>
        render(item, `${item.type}-${index}`),
      )}
    </>
  );
};

export default Renderer;
