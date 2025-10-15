export default interface RepositoryClient {
  close(): Promise<void>;

  isConnected(): boolean;

  get<T>(type: string, conditions?: Conditions): Promise<T[]>;
  add<T>(type: string, value: T): Promise<T>;
  update<T>(type: string, value: T, conditions?: Conditions): Promise<T>;
  delete(type: string, conditions?: Conditions): Promise<void>;

  migrate(direction: 'up' | 'down'): Promise<void>;
}

export type Conditions = { [key: string]: null | number | string };
export type AnyValue = boolean | null | number | string;
