import { Element, ElementInput } from '@content/graph/generated/types';
import DataLoader from '@content/repository/DataLoader';

export type ElementRepository = Element & {
  page: string;
  priority: number;
};

export class PageStructure extends DataLoader<
  Element,
  ElementRepository,
  ElementInput
> {
  constructor() {
    super('page element', 10);
  }
}

const repo = new PageStructure();
export default repo;
