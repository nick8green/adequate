import { Markdown } from '@nick8green/components';
import { Banner } from '@shared/components/banner';
import { FC, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Components: { [key: string]: ReactNode | FC<any> } = {
  Banner,
  Markdown,
};

type RendererProps = {
  structure: PageElement[];
};

export type PageElement = {
  type?: string;
  props?: object;
  content?: string;
};

const Renderer: FC<Readonly<RendererProps>> = ({ structure }) => {
  const render = () => {
    const elements = structure;
    return elements.map((item: PageElement, index: number) =>
      renderItem(item, `${item.type}-${index}`),
    );
  };

  const renderItem = (structure: PageElement, key: string) => {
    const { type, props, content } = structure;
    const Component = type ? Components[type] : Markdown;

    if (!Component) {
      console.error(`component "${type}" not found!`); // eslint-disable-line no-console
      throw new Error(`component "${type}" not found!`);
    }

    if (!content) {
      return <Component key={key} {...props} />;
    }

    return (
      <Component key={key} {...props}>
        {content}
      </Component>
    );
  };

  return <>{render()}</>;
};

export default Renderer;
