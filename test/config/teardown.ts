import { TestDatabaseConfig } from "./config.e2e"

module.exports = async () => {
    const testDatabaseConfig: TestDatabaseConfig = globalThis.databaseConfig;
    await testDatabaseConfig.dropDatabase();
}