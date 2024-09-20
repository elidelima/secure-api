import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path: process.env.NODE_ENV === 'test'
    ? 'test.env'
    : '.env'
});

export default () => ({
  apiPort: parseInt(process.env.API_PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  responseTime: {
    suffix: false,
    header: 'x-response-time'
  }
});