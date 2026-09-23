import dotenv from 'dotenv'

dotenv.config()

/**
 * Centralized, typed access to environment configuration.
 * Reading env vars in one place keeps defaults consistent across the app
 * and makes it obvious which variables the API depends on.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/task-tracker',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
}

export const isProduction = env.nodeEnv === 'production'
