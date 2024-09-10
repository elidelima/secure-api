import { mysqlConfig } from "src/config/database.config";
import { DataSource } from "typeorm";
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import loadUserCredentials from "./user-credentials";

export async function createTestDataSource(
    dbOptions: MysqlConnectionOptions,
) {
    const dataSource = new DataSource(dbOptions);
    await dataSource.initialize();
    return dataSource;
}

const TEST_DATABASE_NAME = 'bkpsys_test';

export class TestDatabaseConfig {
    readonly dbConfigOptions: MysqlConnectionOptions;

    constructor() {
        this.dbConfigOptions = {
            ...mysqlConfig,
            database: TEST_DATABASE_NAME,
        } as MysqlConnectionOptions;
    }

    async createDatabase() {
        await this.dropDatabase();
        console.log(`Creating test database ${this.dbConfigOptions.database}`)
        await createDatabase({
            options: this.dbConfigOptions,
            ifNotExist: false,
        });

        const dataSource = await createTestDataSource(this.dbConfigOptions);

        console.log(`Running migrations & seeds`);
        await dataSource.runMigrations({ transaction: 'all' });

        await loadUserCredentials(dataSource)
        
        await dataSource.destroy();
    }

    async dropDatabase(dropAll = false) {
        console.log(`Dropping test database ${TEST_DATABASE_NAME}`);
        await dropDatabase({
            options: this.dbConfigOptions,
          });
    }
}