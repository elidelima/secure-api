interface EnvironmentVariables {
    apiPort: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
    }
    jwtSecret: string;
}


