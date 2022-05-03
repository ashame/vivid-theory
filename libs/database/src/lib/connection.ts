import { Sequelize, Dialect, Model } from 'sequelize';
import { EventEmitter } from 'events';
import * as models from './models';

class Connection extends EventEmitter {
  static active = false;
  private connection: Sequelize;

  public getConnection(): Sequelize {
    if (!this.connection)
      throw new Error('Database connection not established');
    return this.connection;
  }

  constructor() {
    super();
  }

  async destructor() {
    if (Connection.active) {
      await this.connection.close();
      Connection.active = false;
    }
  }

  async connect() {
    if (Connection.active)
      throw new Error('Database connection already established');

    const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_TYPE, DB_PORT } =
      process.env;

    try {
      const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        dialect: DB_TYPE as Dialect,
        port: Number(DB_PORT),
        ssl: true,
        dialectOptions: {
          ssl: {
            require: true,
          },
        },
      });
      await sequelize.authenticate();
      Connection.active = true;
      models.Readings.Model.init(models.Readings.initSettings, {
        sequelize,
        tableName: 'readings',
      });
      this.connection = sequelize;
      this.emit('connected');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }
}

export default Connection;

export { Connection };
