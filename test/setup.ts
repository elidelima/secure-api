require("tsconfig-paths/register");

import * as dotenv from 'dotenv';
import { TestDatabaseConfig } from './config.e2e';


dotenv.config({ path: '../.env-test'});

module.exports = async () => {
    console.log(`\n\nSetup test environment`);
    const testDatabaseConfig = new TestDatabaseConfig();
    globalThis.databaseConfig = testDatabaseConfig;
    await testDatabaseConfig.createDatabase();
}