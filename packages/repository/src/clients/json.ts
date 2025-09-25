import RepositoryClient, { AnyValue, Conditions } from '@repository/interface';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export default class JsonClient implements RepositoryClient {
  private _directory?: string;

  public async init(): Promise<void> {
    if (!process.env.DATA_DIRECTORY) {
      throw new Error('data directory missing!');
    }
    if (!existsSync(process.env.DATA_DIRECTORY)) {
      throw new Error('data directory does not exist!');
    }
    this._directory = process.env.DATA_DIRECTORY;
  }

  public async close(): Promise<void> {
    delete this._directory;
  }

  public isConnected(): boolean {
    return !!this._directory;
  }

  public async get<T>(type: string, conditions?: Conditions): Promise<T> {
    const file = this.getFilePath(type);
    const data: T = this.parseData(file);

    if (!Array.isArray(data) && conditions) {
      throw new Error('data is not an array!');
    }

    if (Array.isArray(data) && conditions) {
      return data.filter((item) => {
        return Object.entries(conditions).every(([key, value]) => {
          return item[key] === value;
        });
      }) as T;
    }

    return data;
  }

  public async add<T>(type: string, value: T): Promise<void> {
    const file = this.getFilePath(type);
    const data: T = this.parseData(file);

    if (!Array.isArray(data)) {
      throw new Error('data is not an array!');
    }

    (data as unknown as T[]).push(value);

    this.writeToFile(file, data);
  }

  public async update<T>(
    type: string,
    value: T,
    conditions: Conditions,
  ): Promise<void> {
    const initialData = await this.get(type);

    if (!Array.isArray(initialData)) {
      throw new Error('data is not an array!');
    }

    const data: T = ((await this.get<T>(type, conditions)) as T[])[0];
    const index = (initialData as T[]).findIndex((item) => {
      return Object.entries(conditions).every(
        ([key, value]: [string, AnyValue]) => {
          return (item as any)[key] === value; // eslint-disable-line @typescript-eslint/no-explicit-any
        },
      );
    });

    if (index === -1) {
      throw new Error('data not found!');
    }

    (initialData as T[])[index] = { ...data, ...value };

    this.writeToFile(this.getFilePath(type), initialData);
  }

  public async delete(
    type: string,
    conditions: Conditions = {},
  ): Promise<void> {
    const initialData = await this.get(type);
    const data = (initialData as []).filter((item) => {
      return Object.entries(conditions).every(([key, value]) => {
        return item[key] !== value;
      });
    });
    this.writeToFile(this.getFilePath(type), data);
  }

  // private methods

  private getFilePath(type: string): string {
    const file = `${this._directory}/${type}.json`;
    if (!existsSync(file)) {
      throw new Error('data file could not be found!');
    }
    return file;
  }

  private parseData<T>(file: string): T {
    try {
      return JSON.parse(readFileSync(file, 'utf-8'));
    } catch (error) {
      console.error(`Error parsing JSON from ${file}:`, error); //eslint-disable-line no-console
      throw new Error('data could not be parsed!');
    }
  }

  private writeToFile(file: string, data: unknown): void {
    try {
      writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing JSON to ${file}:`, error); //eslint-disable-line no-console
      throw new Error('data could not be written!');
    }
  }

  // setters

  public set directory(path: string) {
    if (!process.env.TESTING) {
      throw new Error('setting directory is only allowed in testing mode!');
    }
    if (!existsSync(path)) {
      throw new Error('data directory does not exist!');
    }
    this._directory = path;
  }
}
