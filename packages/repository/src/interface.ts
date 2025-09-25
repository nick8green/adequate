export default interface RepositoryClient {
  init(): Promise<void>;
  close(): Promise<void>;

  isConnected(): boolean;

  get<T>(type: string, conditions?: Conditions): Promise<T>;
  add<T>(type: string, value: T): Promise<void>;
  update<T>(type: string, value: T, conditions?: Conditions): Promise<void>;
  delete(type: string, conditions?: Conditions): Promise<void>;
}

export type Conditions = { [key: string]: null | number | string };
export type AnyValue = boolean | null | number | string;
