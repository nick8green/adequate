import JsonClient from '@repository/clients/json';
import fs from 'fs';

const fileDoesntExistTest = async (func: string, ...args: any[]) => {
  const client = (await JsonClient.init()) as JsonClient;
  client.directory = '/tmp';

  const type = 'nonExistentType';
  jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  await expect((client as any)[func](type, ...(args ?? []))).rejects.toThrow(
    'data file "/tmp/nonExistentType.json" could not be found!',
  );
};

const notWellFormedTest = async (func: string, ...args: any[]) => {
  const client = (await JsonClient.init()) as JsonClient;
  client.directory = '/tmp';

  const type = 'legitFile';
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid json');
  await expect((client as any)[func](type, ...(args ?? []))).rejects.toThrow(
    'data could not be parsed!',
  );
};

const dataNotAnArrayTest = async (func: string, ...args: any[]) => {
  const client = (await JsonClient.init()) as JsonClient;
  client.directory = '/tmp';

  const type = 'legitFile';
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockReturnValue('{ "id": 1, "name": "Test" }');
  await expect((client as any)[func](type, ...(args ?? []))).rejects.toThrow(
    'data is not an array!',
  );
};

const cannotWriteToFileTest = async (func: string, ...args: any[]) => {
  const client = (await JsonClient.init()) as JsonClient;
  client.directory = '/tmp';

  const type = 'legitFile';
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest
    .spyOn(fs, 'readFileSync')
    .mockReturnValue(
      '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
    );
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
    throw new Error('cannot write to file');
  });
  await expect((client as any)[func](type, ...(args ?? []))).rejects.toThrow(
    'data could not be written!',
  );
};

describe('json client', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    process.env.TESTING = 'true';
  });

  afterAll(() => {
    delete process.env.TESTING;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('init', () => {
    it('should throw an error if data directory is missing', async () => {
      delete process.env.DATA_DIRECTORY;
      await expect(JsonClient.init()).rejects.toThrow(
        'data directory missing!',
      );
    });

    it('should throw an error if data directory does not exist', async () => {
      process.env.DATA_DIRECTORY = '/invalid/path';
      await expect(JsonClient.init()).rejects.toThrow(
        'data directory does not exist!',
      );
    });

    it('should connect if data directory is valid', async () => {
      process.env.DATA_DIRECTORY = '/tmp';
      const client = (await JsonClient.init()) as JsonClient;
      expect(client.isConnected()).toBe(true);
    });
  });

  describe('close', () => {
    it('should reset the directory on close', async () => {
      process.env.DATA_DIRECTORY = '/tmp';
      const client = (await JsonClient.init()) as JsonClient;
      expect(client.isConnected()).toBe(true);
      await client.close();
      expect(client.isConnected()).toBe(false);
    });
  });

  describe('isConnected', () => {
    it('should return false if not initialized', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      expect(client.isConnected()).toBe(false);
    });

    it('should return true if initialized with a valid directory', async () => {
      process.env.DATA_DIRECTORY = '/tmp';
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';
      expect(client.isConnected()).toBe(true);
    });
  });

  describe('get', () => {
    // eslint-disable-next-line jest/expect-expect
    it("errors if the file doesn't exist", async () => {
      await fileDoesntExistTest('get');
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not well-formed', async () => {
      await notWellFormedTest('get');
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not an array when conditions are provided', async () => {
      await dataNotAnArrayTest('get', { id: 1 });
    });

    it('builds the correct file path', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const readSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(JSON.stringify([{ id: 1, name: 'Test' }]));

      const path = '/tmp/data.json';

      client.get('data');

      expect(existsSpy).toHaveBeenCalledWith(path);
      expect(readSpy).toHaveBeenCalledWith(path, 'utf-8');
    });

    it('should retrieve the correct information', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('{ "id": 1, "name": "Test" }');

      type TestData = { id: number; name: string };
      const data = await client.get<TestData>('data');
      expect(data).toEqual({ id: 1, name: 'Test' });
    });

    it('should filter data correctly', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );

      type TestData = { id: number; name: string };
      const data = await client.get<TestData[]>('data', { id: 1 });
      expect(data).toEqual([{ id: 1, name: 'Test' }]);
    });

    it('should filter data correctly for multiple conditions', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );

      type TestData = { id: number; name: string };
      const data = await client.get<TestData[]>('data', {
        id: 1,
        name: 'Test 2',
      });
      expect(data).toEqual([]);
    });

    it('should filter data correctly for multiple conditions that match', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );

      type TestData = { id: number; name: string };
      const data = await client.get<TestData[]>('data', {
        id: 1,
        name: 'Test',
      });
      expect(data).toEqual([{ id: 1, name: 'Test' }]);
    });
  });

  describe('add', () => {
    // eslint-disable-next-line jest/expect-expect
    it("errors if the file doesn't exist", async () => {
      await fileDoesntExistTest('add', {});
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not well-formed', async () => {
      await notWellFormedTest('add', {});
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not an array', async () => {
      await dataNotAnArrayTest('add', {});
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if it cannot write to the file', async () => {
      await cannotWriteToFileTest('add', { id: 3, name: 'Test 3' });
    });

    it('should add a new item', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      const type = 'data';
      const newItem = { id: 3, name: 'Test 3' };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      await client.add(type, newItem);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/tmp/data.json',
        JSON.stringify(
          [{ id: 1, name: 'Test' }, { id: 2, name: 'Test 2' }, newItem],
          null,
          2,
        ),
        'utf-8',
      );
    });
  });

  describe('update', () => {
    // eslint-disable-next-line jest/expect-expect
    it("errors if the data file doesn't exist", async () => {
      await fileDoesntExistTest('update', {}, { id: 1 });
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not well-formed', async () => {
      await notWellFormedTest('update', {}, { id: 1 });
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not an array', async () => {
      await dataNotAnArrayTest('update', {}, { id: 1 });
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if it cannot write to the file', async () => {
      await cannotWriteToFileTest(
        'update',
        { id: 3, name: 'Test 3' },
        { id: 2 },
      );
    });

    it('errors if there is no record to update', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );

      await expect(
        client.update('data', { id: 3, name: 'Something' }, { id: 3 }),
      ).rejects.toThrow('data not found!');
    });

    it('should update an existing item', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      await client.update('data', { id: 1, name: 'Something' }, { id: 1 });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/tmp/data.json',
        JSON.stringify(
          [
            { id: 1, name: 'Something' },
            { id: 2, name: 'Test 2' },
          ],
          null,
          2,
        ),
        'utf-8',
      );
    });
  });

  describe('delete', () => {
    // eslint-disable-next-line jest/expect-expect
    it("errors if the data file doesn't exist", async () => {
      await fileDoesntExistTest('delete', {});
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if the data is not well-formed', async () => {
      await notWellFormedTest('delete', {});
    });

    // eslint-disable-next-line jest/expect-expect
    it('errors if it cannot write to the file', async () => {
      await cannotWriteToFileTest('delete', { id: 3 });
    });

    it('should delete an existing item', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      client.directory = '/tmp';

      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const readSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(
          '[{ "id": 1, "name": "Test" }, { "id": 2, "name": "Test 2" }]',
        );
      const writeSpy = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => {});

      await client.delete('data', { id: 1 });

      expect(existsSpy).toHaveBeenCalledWith('/tmp/data.json');
      expect(readSpy).toHaveBeenCalledWith('/tmp/data.json', 'utf-8');
      expect(writeSpy).toHaveBeenCalledWith(
        '/tmp/data.json',
        JSON.stringify([{ id: 2, name: 'Test 2' }], null, 2),
        'utf-8',
      );
    });
  });

  describe('migrate', () => {
    it('should resolve without doing anything', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      await expect(client.migrate()).resolves.toBeUndefined();
    });
  });

  describe('set directory', () => {
    it('should throw an error if not in testing mode', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      delete process.env.TESTING;
      expect(() => {
        client.directory = '/new/directory';
      }).toThrow('setting directory is only allowed in testing mode!');
    });

    it('should throw an error if the directory does not exist', async () => {
      const client = (await JsonClient.init()) as JsonClient;
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(() => {
        client.directory = '/non/existent/directory';
      }).toThrow('data directory does not exist!');
    });
  });
});
