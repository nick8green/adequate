import { PageInfo } from '@content/graph/generated/types';

export enum CursorType {
  id = 'id',
}

const getCursorValue = <T>(item: T | undefined, identifier: keyof T): string =>
  item ? String(item[identifier]) : '';

export const paginate = <T>(
  data: T[],
  identifier: keyof T,
  cursor?: string | null,
  limit?: number | null,
): [PageInfo, T[]] => {
  if (data.length === 0) {
    return [
      {
        startCursor: '',
        endCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
      },
      [],
    ];
  }

  const startIndex = cursor
    ? data.findIndex((item) => String(item[identifier]) === cursor)
    : 0;

  const sliceStart = startIndex >= 0 ? startIndex : 0;
  const sliceEnd = limit ? sliceStart + limit : undefined;
  const paginatedData = data.slice(sliceStart, sliceEnd);

  const pageInfo: PageInfo = {
    startCursor: getCursorValue<T>(paginatedData[0], identifier),
    endCursor: getCursorValue<T>(
      paginatedData[paginatedData.length - 1],
      identifier,
    ),
    hasPreviousPage: sliceStart > 0,
    hasNextPage: limit ? sliceStart + limit < data.length : false,
  };

  return [pageInfo, paginatedData];
};
