import MySQLClient, { Interactions } from '@repository/clients/mysql';

class TestClient extends MySQLClient {
  static override async init(): Promise<TestClient> {
    const base = await super.init();
    Object.setPrototypeOf(base, TestClient.prototype);
    return base as TestClient;
  }

  public buildInsertQuery(
    type: string,
    value: Record<string, boolean | number | null | string>,
  ): string {
    return this.buildQuery(Interactions.CREATE, type, undefined, value);
  }
}

describe('mysql client', () => {
  it.todo('write tests for mysql client methods');

  describe('build query', () => {
    it('should build an insert query', async () => {
      const client = await TestClient.init();
      const query = client.buildInsertQuery('test table', { page: 1, type: 2 });
      expect(query).toBe('INSERT INTO TestTable (page, type) VALUES (?, ?);');
    });
  });
});
