export default () => ({
  apiPort: parseInt(process.env.API_PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
});