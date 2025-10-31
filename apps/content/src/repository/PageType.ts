import DataLoader from '@content/repository/DataLoader';
import { client } from '@repository/client';

export type PageTypeRepository = {
  page: number;
  type: number;
};
export type PageTypeInput = {
  name: string;
  page: number;
};

export class PageType extends DataLoader<
  { type: string },
  PageTypeRepository,
  PageTypeInput
> {
  constructor() {
    super('page type');
  }

  public async create(item: PageTypeInput): Promise<{ type: string }> {
    await super.create(item);
    return { type: item.name };
  }

  public async update(
    id: number,
    item: PageTypeInput,
  ): Promise<{ type: string }> {
    await client.update<PageTypeRepository>(
      'page type',
      await this.inputToRepository(item),
      { page: id },
    );
    return { type: item.name };
  }

  protected async inputToRepository(
    item: PageTypeInput,
  ): Promise<PageTypeRepository> {
    const types = await client.get<{ id: number; name: string }>('type', {
      name: item.name.toLowerCase(),
    });
    if (types.length === 0) {
      throw new Error(`type with name ${item.name} not found`);
    }
    return {
      page: item.page,
      type: types[0].id,
    };
  }
}

const repo = new PageType();
export default repo;
