import Connection from './connection';

describe('dbConnection', () => {
  let db: Connection;

  beforeEach(() => {
    db = null;
  });

  afterEach(() => {
    if (db) db.destructor();
  });

  it('should be defined', async () => {
    db = new Connection();
    expect(db).toBeDefined();
  });

  it('should connect to the database', async () => {
    db = new Connection();
    db.emit = jest.fn();
    await db.connect();
    expect(db.emit).toHaveBeenCalledWith('connected');
    expect(db.getConnection()).toBeDefined();
  });

  it('should throw an error if the connection is already established', async () => {
    db = new Connection();
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
    db = new Connection();
    try {
      db.getConnection();
    } catch (e) {
      expect(e.message).toBe('Database connection not established');
    }
    expect(db.getConnection).toThrowError();
  });
});
