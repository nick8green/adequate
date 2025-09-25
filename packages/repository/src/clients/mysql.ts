import RepositoryClient, { Conditions } from '@repository/interface';

export default class MySQLClient implements RepositoryClient {
  private static instance: MySQLClient;

  private constructor() {}

  public static async init(): Promise<RepositoryClient> {
    if (!MySQLClient.instance) {
      MySQLClient.instance = new MySQLClient();
    }
    return MySQLClient.instance;
  }

  public async close(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public isConnected(): boolean {
    throw new Error('Method not implemented.');
  }

  public get<T>(type: string, conditions?: Conditions): Promise<T> {
    console.log('MySQLClient.get called with', { type, conditions }); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }

  public add<T>(type: string, value: T): Promise<void> {
    console.log('MySQLClient.add called with', { type, value }); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }

  public update<T>(
    type: string,
    value: T,
    conditions?: Conditions,
  ): Promise<void> {
    console.log('MySQLClient.update called with', { type, value, conditions }); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }

  public delete(type: string, conditions?: Conditions): Promise<void> {
    console.log('MySQLClient.delete called with', { type, conditions }); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }

  public async migrate(): Promise<void> {
    console.log('MySQLClient.migrate called'); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }
}
