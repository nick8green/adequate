import RepositoryClient, { Conditions } from '@repository/interface';
import * as Env from '@repository/utils/environment';
import { readdirSync, readFileSync } from 'fs';
import mysql, {
  FieldPacket,
  Pool,
  PoolConnection,
  QueryResult,
  RowDataPacket,
} from 'mysql2/promise';

type Pools = {
  master?: Pool;
  migrate?: Pool;
  read?: Pool;
  write?: Pool;
};

enum Interactions {
  CREATE,
  DELETE,
  GET,
  UPDATE,
}

export default class MySQLClient implements RepositoryClient {
  private static instance: MySQLClient;
  private readonly pools: Pools;

  private constructor() {
    this.pools = {};
    this.connect();
  }

  public static async init(): Promise<RepositoryClient> {
    if (!MySQLClient.instance) {
      MySQLClient.instance = new MySQLClient();
    }
    return MySQLClient.instance;
  }

  public async close(): Promise<void> {
    if (this.pools.master) {
      this.pools.master.end();
    }
    if (this.pools.read) {
      this.pools.read.end();
    }
    if (this.pools.write) {
      this.pools.write.end();
    }
    if (this.pools.migrate) {
      this.pools.migrate.end();
    }
  }

  public isConnected(): boolean {
    return Object.values(this.pools).some((pool) => pool !== undefined);
  }

  public async get<T>(type: string, conditions?: Conditions): Promise<T[]> {
    console.log('MySQLClient.get called with', { type, conditions }); // eslint-disable-line no-console
    const [rows] = await this.execute(
      this.pools?.read,
      this.buildQuery(Interactions.GET, type, conditions),
      Object.values(conditions || {}),
    );
    return (rows as RowDataPacket[]).map((r: RowDataPacket) => {
      Object.keys(r).forEach((key) => {
        if (this.isJsonField(r[key])) {
          try {
            r = {
              ...r,
              ...(typeof r[key] === 'string'
                ? JSON.parse(r[key] as unknown as string)
                : r[key]),
            };
          } catch (e) {
            console.warn(`Failed to parse JSON field ${key}:`, e); // eslint-disable-line no-console
          }
        }
      });
      return r as T;
    });
  }

  public async add<T>(type: string, value: T): Promise<T> {
    console.log('MySQLClient.add called with', { type, value }); // eslint-disable-line no-console

    const query = this.buildQuery(
      Interactions.UPDATE,
      type,
      {},
      value as Record<string, boolean | number | null | string>,
    );

    try {
      const [result, fields] = await this.execute(this.pools?.write, query, [
        ...Object.values(
          value as Record<string, boolean | number | null | string>,
        ),
      ]);
      // return (await this.get<T>(type, conditions) as T[])[0];
      console.log('ADD RESULTS:', result, fields);
      return value;
    } catch (error) {
      console.error('failed to execute update', error); // eslint-disable-line no-console
      throw error;
    }
  }

  public async update<T>(
    type: string,
    value: T,
    conditions?: Conditions,
  ): Promise<T> {
    console.log('MySQLClient.update called with', { type, value, conditions }); // eslint-disable-line no-console

    const query = this.buildQuery(
      Interactions.UPDATE,
      type,
      conditions,
      value as Record<string, boolean | number | null | string>,
    );
    const data = [
      ...Object.values(
        value as Record<string, boolean | number | null | string>,
      ),
      ...Object.values(conditions || {}),
    ];

    try {
      await this.execute(this.pools?.write, query, data);
      return ((await this.get<T>(type, conditions)) as T[])[0];
    } catch (error) {
      console.error('failed to execute update', error); // eslint-disable-line no-console
      throw error;
    }
  }

  public delete(type: string, conditions?: Conditions): Promise<void> {
    console.log('MySQLClient.delete called with', { type, conditions }); // eslint-disable-line no-console
    throw new Error('Method not implemented.');
  }

  public async migrate(direction: 'up' | 'down'): Promise<void> {
    console.log('MySQLClient.migrate called'); // eslint-disable-line no-console
    const lastMigration = (
      await this.get<{ stamp: number }>('SchemaMigrations')
    )[0];
    if (!lastMigration) {
      throw new Error('no migration found');
    }
    readdirSync(Env.mustBeString('DATA_MIGRATIONS'))
      .filter((f) => {
        // add check that the timestamp is greater/less than the last migration
        return f.endsWith(`${direction}.sql`);
      })
      .sort((a: string, b: string) => {
        // extract timestamp from filename and compare
        const timestampA = parseInt(a.split('_')[0]);
        const timestampB = parseInt(b.split('_')[0]);
        return timestampA - timestampB;
      })
      .forEach(async (file: string) => {
        const timestamp = parseInt(file.split('_')[0]);
        if (
          (direction === 'up' && timestamp <= lastMigration.stamp) ||
          (direction === 'down' && timestamp >= lastMigration.stamp)
        ) {
          return;
        }

        console.log(`applying migration: ${file}`); // eslint-disable-line no-console
        const sql = readFileSync(
          `${Env.mustBeString('DATA_MIGRATIONS')}/${file}`,
          'utf8',
        );
        const connection = await this.getConnection(this.pools?.migrate);
        try {
          await connection.query(sql);
          this.update<{ stamp: number; dirty?: boolean }>('SchemaMigrations', {
            stamp: timestamp,
            dirty: false,
          });
        } catch (error) {
          console.error(`failed to apply migration: ${file}`, error); // eslint-disable-line no-console
          this.update<{ stamp: number; dirty?: boolean }>('SchemaMigrations', {
            stamp: timestamp,
            dirty: true,
          });
          throw error;
        } finally {
          connection.release();
        }
      });
  }

  // private methods

  private buildQuery(
    interaction: Interactions,
    type: string,
    conditions?: Conditions,
    data?: Record<string, boolean | null | number | string>,
  ): string {
    const constraints = Object.keys(conditions || {}).map(
      (key: string) => `${key} = ?`,
    );
    const table = type.replace(/^(\w)/g, (s: string) => s.toLocaleUpperCase());

    switch (interaction) {
      case Interactions.CREATE:
        return `INSERT INTO ${table} (${Object.keys(data || {}).join(', ')}) VALUES (${Object.keys(
          data || {},
        )
          .map(() => '?')
          .join(', ')});`;
      case Interactions.DELETE:
        return `DELETE FROM ${table}${conditions ? ` WHERE ${constraints.join(' AND ')}` : ''};`;
      case Interactions.GET:
        return `SELECT * FROM ${table}${conditions ? ` WHERE ${constraints.join(' AND ')}` : ''};`;
      case Interactions.UPDATE:
        return `UPDATE ${table} SET ${Object.keys(data || {})
          .map((key: string) => `${key} = ?`)
          .join(
            ', ',
          )}${conditions ? ` WHERE ${constraints.join(' AND ')}` : ''};`;
      default:
        throw new Error('invalid interaction specified!');
    }
  }

  private connect(): void {
    if (Env.exists('DB_USER')) {
      this.pools.master = mysql.createPool({
        connectionLimit: Env.number('DB_CONNECTION_LIMIT') || 5,
        host: Env.mustBeString('DB_HOST'),
        user: Env.mustBeString('DB_USER'),
        password: Env.mustBeString('DB_PASSWORD'),
        database: Env.mustBeString('DB_NAME'),
        port: Env.number('DB_PORT') || 3306,
        multipleStatements: true,
      });
    }
    if (Env.exists('DB_READER_USER')) {
      this.pools.read = mysql.createPool({
        connectionLimit: Env.number('DB_READER_CONNECTION_LIMIT') || 5,
        host: Env.mustBeString('DB_HOST'),
        user: Env.mustBeString('DB_READER_USER'),
        password: Env.mustBeString('DB_READER_PASSWORD'),
        database: Env.mustBeString('DB_NAME'),
        port: Env.number('DB_PORT') || 3306,
        multipleStatements: false,
      });
    }

    if (Env.exists('DB_WRITER_USER')) {
      this.pools.write = mysql.createPool({
        connectionLimit: Env.number('DB_WRITER_CONNECTION_LIMIT') || 5,
        host: Env.mustBeString('DB_HOST'),
        user: Env.mustBeString('DB_WRITER_USER'),
        password: Env.mustBeString('DB_WRITER_PASSWORD'),
        database: Env.mustBeString('DB_NAME'),
        port: Env.number('DB_PORT') || 3306,
        multipleStatements: false,
      });
    }

    if (Env.exists('DB_MIGRATION_USER')) {
      this.pools.migrate = mysql.createPool({
        connectionLimit: Env.number('DB_MIGRATION_CONNECTION_LIMIT') || 1,
        host: Env.mustBeString('DB_HOST'),
        user: Env.mustBeString('DB_MIGRATION_USER'),
        password: Env.mustBeString('DB_MIGRATION_PASSWORD'),
        database: Env.mustBeString('DB_NAME'),
        port: Env.number('DB_PORT') || 3306,
        multipleStatements: true,
      });
    }
  }

  private async execute(
    pool: Pool | undefined,
    query: string,
    data: Array<boolean | number | null | string>,
  ): Promise<[QueryResult, FieldPacket[]]> {
    console.log(`executing query: ${query}`); // eslint-disable-line no-console
    const connection = await this.getConnection(pool);
    try {
      const [rows, fields] = await connection.execute(query, data);
      return [rows, fields];
    } catch (error) {
      console.error(`error executing query: ${(error as Error).message}`); // eslint-disable-line no-console
      throw error;
    } finally {
      console.debug('releasing connection'); // eslint-disable-line no-console
      connection.release();
    }
  }

  private async getConnection(pool?: Pool): Promise<PoolConnection> {
    const p = pool || this.pools.master;
    if (!p) {
      throw new Error('no connection to the database detected!');
    }
    const connection: PoolConnection = await p.getConnection();
    await connection.ping();
    return connection;
  }

  private isJsonField(value: unknown): value is Record<string, unknown> {
    if (typeof value === 'object') return true;
    if (typeof value !== 'string') return false;
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  }
}
