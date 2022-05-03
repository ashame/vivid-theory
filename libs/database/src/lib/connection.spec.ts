import Connection from './connection';

describe('dbConnection', () => {
  let db: Connection;

  beforeEach(() => {
    db = new Connection();
  });

  afterEach(async () => {
    if (db) await db.destructor();
  });

  it('should be defined', async () => {
    expect(db).toBeDefined();
  });

  it('should connect to the database', async () => {
    db.emit = jest.fn();
    await db.connect();
    expect(db.emit).toHaveBeenCalledWith('connected');
    expect(db.getConnection()).toBeDefined();
  });

  it('registers the readings model', async () => {
    db.emit = jest.fn();
    await db.connect();
    expect(db.emit).toHaveBeenCalledWith('connected');
    expect(db.getConnection().models.readings).toBeDefined();
    expect(db.getConnection().models.notreadings).not.toBeDefined();
  });

  it('logs an error upon failure to connect', async () => {
    let tmp = process.env;
    process.env = {};
    console.error = jest.fn();
    try {
      await db.connect();
    } catch {}
    process.env = tmp;
    expect(console.error).toBeCalledTimes(1);
  });

  it('should throw an error if the connection is already established', async () => {
    db.emit = jest.fn();
    try {
      await db.connect();
      expect(db.emit).toHaveBeenCalledWith('connected');
      await db.connect();
    } catch (err) {
      expect(err).toBeDefined();
    }
    expect(db.getConnection()).toBeDefined();
  });

  it('should throw an error if the connection is not established', async () => {
    try {
      db.getConnection();
    } catch (e) {
      expect(e.message).toBe('Database connection not established');
    }
    expect(db.getConnection).toThrowError();
  });

  it('should allow querying the database', async () => {
    try {
      await db.connect();
    } catch {
      expect(true).toBe(false);
    }
    const query = 'SELECT 1';
    const result = db.getConnection().query(query);

    expect(result).toBeDefined();
  });
});
