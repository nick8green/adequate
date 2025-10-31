import { client } from '@repository/client';

interface RepositoryItem {
  id: string | number;
}

export default abstract class DataLoader<B, R, I> {
  private loadedAt: Date | null;
  private data: R[] | null;

  private readonly CACHE_TTL: number;

  private _dataType: string;

  constructor(dataType: string, ttl: number = 360) {
    this.loadedAt = null;
    this.data = null;
    this._dataType = dataType;
    this.CACHE_TTL = ttl * 1000;
  }

  public async getAll(): Promise<B[]> {
    const data = await this.getRawData();
    return (await Promise.all(
      data.map(async (item) => await this.repositoryToDomain(item)),
    )) as unknown as B[];
  }

  public async getRawData(): Promise<R[]> {
    console.log('fetching data from repository...'); // eslint-disable-line no-console

    const now = new Date();
    console.log(
      'cache debugging:',
      now,
      this.loadedAt,
      this.CACHE_TTL,
      now.getTime(),
      this.CACHE_TTL,
      this.data &&
        this.loadedAt &&
        now.getTime() - this.loadedAt.getTime() < this.CACHE_TTL,
    );

    if (
      this.data &&
      this.loadedAt &&
      now.getTime() - this.loadedAt.getTime() < this.CACHE_TTL
    ) {
      console.log('returning cached data...'); // eslint-disable-line no-console
      return this.data;
    }

    console.log('cache miss, loading data from repository...'); // eslint-disable-line no-console
    const data = await client.get<R>(this._dataType);

    this.data = data;
    this.loadedAt = now;
    console.log('data loaded at', this.loadedAt);

    return this.data;
  }

  public async get(id: number | string): Promise<B> {
    console.log(`fetching item ${id} from repository...`); // eslint-disable-line no-console
    if (!this.data) {
      await this.getAll();
    }
    if (!this.data) {
      throw new Error('Failed to load data!');
    }
    const idType = typeof id === 'number' ? 'id' : 'uuid';
    const item = this.data.find((p) => (p as any)[idType] === id); // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!item) {
      throw new Error(`item with id ${id} not found`);
    }
    return item as unknown as B;
  }

  public async create(item: I): Promise<B> {
    const id = await client.add<R>(
      this._dataType,
      await this.inputToRepository(item),
    );
    console.log(`created ${this._dataType} with id:`, id);

    this.clearCache();

    const allData: (R & RepositoryItem)[] = (await this.getRawData()) as (R &
      RepositoryItem)[];
    const i: (R & RepositoryItem) | undefined = allData.find(
      (d: R & RepositoryItem) => d.id === id,
    );

    return await this.repositoryToDomain(i as unknown as R);
  }

  public async update(id: number | string, item: I): Promise<B> {
    console.log(`updating page ${id} in repository...`); // eslint-disable-line no-console
    const idType = typeof id === 'number' ? 'id' : 'uuid';
    await client.update<R>(this._dataType, await this.inputToRepository(item), {
      [idType]: id,
    });
    return await this.get(id);
  }

  public async delete(id: number | string): Promise<boolean> {
    console.log(`deleting element ${id} from repository...`); // eslint-disable-line no-console
    const idType = typeof id === 'number' ? 'id' : 'uuid';
    await client.delete(this._dataType, { [idType]: id });
    this.clearCache();
    return (await this.get(id)) === null;
  }

  protected clearCache(): void {
    this.data = null;
    this.loadedAt = null;
  }

  protected set dataType(name: string) {
    // need to add some safety checks here
    console.log(`changing data type from ${this._dataType} to ${name}`);
    this._dataType = name;
  }

  protected async repositoryToDomain(item: R): Promise<B> {
    return item as unknown as B;
  }

  protected async inputToRepository(item: I): Promise<R> {
    return item as unknown as R;
  }
}
