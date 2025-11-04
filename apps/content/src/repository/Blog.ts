import { type Post as PostDomain } from '@content/graph/generated/types';
import DataLoader from '@content/repository/DataLoader';

export type PostRepository = Omit<PostDomain, 'meta'> & { page: number };

export class Post extends DataLoader<PostDomain, PostRepository, object> {
  constructor() {
    super('post');
  }
}

const repo = new Post();
export default repo;
