import {
  Element,
  NavigationType,
  Page,
  PageInput,
  PageMeta,
  PageType,
} from '@content/graph/generated/types';
import DataLoader from '@content/repository/DataLoader';
import structureRepo, {
  PageElementRepository,
  PageStructure,
} from '@content/repository/PageStructure';
import typeRepo, {
  PageType as PageTypeLoader,
} from '@content/repository/PageType';

type PageRepository = Omit<
  Page,
  'tags' | 'structure' | 'id' | 'meta' | 'type'
> & {
  meta_description: string;
  meta_title?: string;
  navigation_types?: string;
  navigation_priorities?: string;
  tags?: string;
  uuid?: string;
  id?: number;
};

class Pages extends DataLoader<Page, PageRepository, PageInput> {
  private structureRepo: PageStructure;
  private typeRepo: PageTypeLoader;

  constructor() {
    super('pages', 10);
    this.structureRepo = structureRepo;
    this.typeRepo = typeRepo;
  }

  public async create(item: PageInput): Promise<Page> {
    this.dataType = 'page';
    const record = await super.create(item);
    this.dataType = 'pages';

    const allPages = await this.getRawData();
    const newPage = allPages.find((p) => p.uuid === record.id);
    if (!newPage) {
      throw new Error('failed to retrieve newly created page');
    }
    console.log('created page record:', record, newPage);

    // type
    await this.typeRepo.create({
      name: item.type || 'page',
      page: newPage.id as number,
    });

    // structure

    this.clearCache();
    return this.repositoryToDomain(
      (await this.get(record.id)) as unknown as PageRepository,
    );
  }

  public async update(id: string, item: PageInput): Promise<Page> {
    const page: PageRepository | undefined = (await this.getRawData()).find(
      (p) => p.uuid === id,
    );
    if (!page) {
      throw new Error(`page with id ${id} not found`);
    }
    if (!page.id) {
      throw new Error(`page with id ${id} has no numeric ID`);
    }

    // base
    this.dataType = 'page';
    await super.update(page.id, item);
    this.dataType = 'pages';

    // type
    await this.typeRepo.update(page.id, {
      name: item.type || 'page',
      page: page.id as number,
    });

    // structure

    this.clearCache();
    return this.repositoryToDomain(
      (await this.get(id)) as unknown as PageRepository,
    );
  }

  public async delete(id: number | string): Promise<boolean> {
    this.dataType = 'page';
    try {
      return await super.delete(id);
    } catch (error) {
      if ((error as Error).message === `item with id ${id} not found`) {
        return true;
      }
      throw error;
    } finally {
      this.dataType = 'pages';
    }
  }

  protected async repositoryToDomain(item: PageRepository): Promise<Page> {
    const page: Page = { ...item } as unknown as Page;
    const structure = (await this.structureRepo.getRawData())
      .filter((el: PageElementRepository) => el.page === item.uuid)
      .sort(
        (a: PageElementRepository, b: PageElementRepository) =>
          a.priority - b.priority,
      ) as unknown as Element[];

    const tags =
      item.tags && typeof item.tags === 'string'
        ? item.tags.split(',').map((tag) => tag.trim())
        : [];

    page.meta = this.formatMeta(item);
    page.type = page.type?.toUpperCase() as PageType;

    if (!item.uuid) {
      throw new Error('page has no uuid');
    }

    return { ...page, id: item.uuid, structure, tags };
  }

  protected async inputToRepository(item: PageInput): Promise<PageRepository> {
    const repoItem: Omit<PageRepository, 'meta' | 'type'> = {
      ...item,
      meta_description: item.meta?.description || '',
      tags: item.tags ? item.tags.join(',') : ('' as string),
    };
    delete (repoItem as any).meta; // eslint-disable-line @typescript-eslint/no-explicit-any
    delete (repoItem as any).structure; // eslint-disable-line @typescript-eslint/no-explicit-any
    delete (repoItem as any).type; // eslint-disable-line @typescript-eslint/no-explicit-any
    return repoItem;
  }

  private formatMeta(page: PageRepository): PageMeta {
    const meta: PageMeta = {
      title: page?.meta_title ?? '',
      navigation: [],
    };

    for (const key in page) {
      if (key.startsWith('meta_')) {
        const metaKey = key.replace('meta_', '');
        // @ts-expect-error due to dynamic key assignment
        meta[metaKey] = page[key];
      }
    }

    if (page.navigation_types && page.navigation_priorities) {
      const types = page.navigation_types.split(',');
      const priorities = page.navigation_priorities
        .split(',')
        .map((p) => parseInt(p, 10));
      meta.navigation = types.map((type: string, index: number) => ({
        type: type as NavigationType,
        priority: priorities[index],
      }));
    }

    return meta;
  }
}

const repo = new Pages();
export default repo;
