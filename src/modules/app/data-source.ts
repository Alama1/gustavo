import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const dotenvPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenvPath });
const baseConfig = {
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const extraOption = baseConfig;

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_DATABASE || 'db.sqlite',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
  synchronize: process.env.DB_INIT === 'true',
  migrationsRun: false,
  extra: extraOption,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
