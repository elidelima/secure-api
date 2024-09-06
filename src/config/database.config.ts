import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}',],
  migrations: [__dirname + '/../database/migrations/*.ts',],
  // logging: true,
}

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => mysqlConfig,
);

export const connectionSource = new DataSource(mysqlConfig as DataSourceOptions);
