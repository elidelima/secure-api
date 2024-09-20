interface EnvironmentVariables {
    apiPort: number;
    jwtSecret: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
        database: string;
        entities: string;
        autoLoadEntities: boolean;
        synchronize: boolean;
    },
    responseTime: {
        header: string;
        suffix: boolean;
    },
    cache: {}
}