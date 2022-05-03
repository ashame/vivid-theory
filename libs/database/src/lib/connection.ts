import { Sequelize } from 'sequelize-typescript';
import { EventEmitter } from 'events';
import { Dialect } from 'sequelize/types';

let _sequelize: Sequelize;

class Connection extends EventEmitter {

  public getConnection(): Sequelize {
    if (!_sequelize)
      throw new Error('Database connection not established');
    return _sequelize;
  }

  constructor() {
    super();
  }

  destructor() {
    if (_sequelize)
      _sequelize.close().finally(() => _sequelize = null);
  }

  async connect() {
    if (_sequelize)
      throw new Error('Database connection already established');

    const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_TYPE, DB_PORT } = process.env;
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      host: DB_HOST,
      dialect: DB_TYPE as Dialect || 'postgres',
      port: Number(DB_PORT),
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true
        }
      }
    });

    try {
      await sequelize.authenticate();
      _sequelize = sequelize;
      this.emit('connected');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }
}

export default Connection;