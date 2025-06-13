import { FC } from 'react';

type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  slug: string[];
};

const Page: FC<Readonly<PageProps>> = async ({ params = {}, slug = [] }) => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();

  return (
    <div>
      <p>Slug: {slug.join('/')}</p>
      <p>Params: {JSON.stringify(params)}</p>
    </div>
  );
};

export default Page;
