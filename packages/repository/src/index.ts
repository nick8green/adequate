import JsonClient from '@repository/clients/json';
import MySQLClient from '@repository/clients/mysql';
import RepositoryClient, { Conditions } from '@repository/interface';

export class Client implements RepositoryClient {
  private client?: RepositoryClient;

  public async init(): Promise<void> {
    switch (process.env.REPOSITORY_DIALECT) {
      case 'json':
        this.client = new JsonClient();
        break;
      case 'mysql':
        this.client = new MySQLClient();
        break;
      default:
        throw new Error('Unsupported repository dialect');
    }
    await this.client.init();
  }

  public async close(): Promise<void> {
    if (!this.client) {
      return;
    }
    return this.client.close();
  }

  public isConnected(): boolean {
    if (!this.client) {
      return false;
    }
    return this.client.isConnected();
  }

  get<T>(type: string, conditions?: Conditions): Promise<T> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return this.client.get<T>(type, conditions);
  }

  add<T>(type: string, value: T): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return this.client.add<T>(type, value);
  }

  update<T>(type: string, value: T, conditions?: Conditions): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return this.client.update<T>(type, value, conditions);
  }

  delete(type: string, conditions?: Conditions): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return this.client.delete(type, conditions);
  }
}

export const client = new Client();
export default client;
