import mongoose from 'mongoose'
import { env } from './env.js'

/**
 * Establish the MongoDB connection using Mongoose.
 * Exits the process on failure so orchestration (Docker/Kubernetes) can
 * restart the container rather than run in a broken state.
 */
export async function connectDB(uri: string = env.mongoUri): Promise<typeof mongoose> {
  try {
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

/**
 * Gracefully close the MongoDB connection (used by tests and shutdown hooks).
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect()
}
