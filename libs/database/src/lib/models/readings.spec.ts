import * as database from '@vivid-theory/database';

describe('Readings model', () => {
  let db: database.Connection;
  beforeAll(async () => {
    db = new database.Connection();
    await db.connect();
  });
  it('allows queries', async () => {
    let res = await db.getConnection().models.readings.findOne({
      attributes: ['Serial_Number', 'DateTime', 'Device_ID', 'Wattage'],
    });
    expect(res).toBeDefined();
  });

  afterAll(async () => {
    if (db) await db.destructor();
  });
});
