import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port:            parseInt(process.env.PORT || '3001', 10),
  nodeEnv:         process.env.NODE_ENV || 'development',
  frontendUrl:     process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret:       process.env.JWT_SECRET || 'xlnet-super-secret-key-change-in-production',
  jwtExpiresIn:    process.env.JWT_EXPIRES_IN || '7d',
  uploadDir:       process.env.UPLOAD_DIR || './uploads',
  maxFileSize:     parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  databaseUrl:     process.env.DATABASE_URL,
}));
