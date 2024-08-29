export default () => ({
  apiPort: parseInt(process.env.API_PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET,
});