import JsonClient from '@repository/clients/json';
import MySQLClient from '@repository/clients/mysql';
import RepositoryClient, { Conditions } from '@repository/interface';

export class Client implements RepositoryClient {
  private client?: RepositoryClient;

  public async init(): Promise<RepositoryClient> {
    switch (process.env.REPOSITORY_DIALECT) {
      case 'json':
        this.client = await JsonClient.init();
        break;
      case 'mysql':
        this.client = await MySQLClient.init();
        break;
      default:
        throw new Error('Unsupported repository dialect');
    }
    return this.client;
  }

  public async close(): Promise<void> {
    if (!this.client) {
      return;
    }
    return await this.client.close();
  }

  public isConnected(): boolean {
    if (!this.client) {
      return false;
    }
    return this.client.isConnected();
  }

  public async get<T>(type: string, conditions?: Conditions): Promise<T[]> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return await this.client.get<T>(type, conditions);
  }

  public async add<T>(type: string, value: T): Promise<T> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return await this.client.add<T>(type, value);
  }

  public async update<T>(
    type: string,
    value: T,
    conditions?: Conditions,
  ): Promise<T> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return await this.client.update<T>(type, value, conditions);
  }

  public async delete(type: string, conditions?: Conditions): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return await this.client.delete(type, conditions);
  }

  public async migrate(direction: 'up' | 'down' = 'up'): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return await this.client.migrate(direction);
  }
}

export const client = new Client();
export default client;
