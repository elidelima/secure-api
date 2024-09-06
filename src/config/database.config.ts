import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

type MyDataSourceOptions = DataSourceOptions & TypeOrmModuleOptions & {
  seeds?: string[],
  factories?: string[],
}

export const mysqlConfig: MyDataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}',],
  migrations: [__dirname + '/../database/migrations/*.ts',],
  seeds: [__dirname + '/../**/seeds/*{.ts,.js}',],
  // logging: true,
}

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => mysqlConfig,
);

export const connectionSource = new DataSource(mysqlConfig);
