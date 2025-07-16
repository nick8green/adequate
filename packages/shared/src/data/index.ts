import { PageElement } from '@shared/components/renderer';

export const getPage = async (
  slug: string[],
  params?: { [key: string]: string | string[] | undefined },
): Promise<PageElement[]> => {
  // Simulate fetching data based on slug and params
  // In a real application, this would be replaced with an actual data fetching logic
  const structure = [
    {
      content: `Slug: ${slug.join('/')}\n\nParams: ${JSON.stringify(params)}`,
    },
  ];

  // Simulate a condition to return not found (for example, if slug is about)
  if (slug[0] === 'about') {
    return [
      {
        type: 'Banner',
        props: {
          title: 'About Us',
          description: 'This is the about page.',
          image: '/assets/images/coding.jpg',
          side: 'left',
        },
      },
      {
        type: 'Markdown',
        content: 'This is the about page content.',
      },
      {
        type: 'Banner',
        props: {
          title: 'Contact Us',
          description: 'This is the contact page.',
          image: '/assets/images/desk.jpg',
          side: 'right',
        },
      },
    ];
  }

  // Simulate a condition to return not found (for example, if slug is about)
  if (slug[0] === 'not-found') {
    throw new Error('Page not found');
  }

  // Simulate a condition to return not found (for example, if slug is contect)
  if (slug[0] === 'error') {
    throw new Error('Some error occurred!');
  }

  return structure;
};
