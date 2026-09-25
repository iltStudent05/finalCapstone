import mongoose from 'mongoose'
import { connectDB, disconnectDB } from './config/db.js'
import { User } from './models/User.js'
import { Project } from './models/Project.js'
import { Task } from './models/Task.js'
import { Comment } from './models/Comment.js'

/**
 * Seed / clear utility for the Project Task Tracker database.
 *
 *   npm run seed          -> wipe the four collections, then insert demo data
 *   npm run seed:clear    -> wipe the four collections only (no insert)
 *
 * Safe to re-run: it always clears first so you never get duplicates.
 * This is a developer/demo convenience and is not required by the spec.
 */

/** Remove all documents from the app-owned collections. */
async function clearAll(): Promise<void> {
  await Promise.all([
    Comment.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({}),
  ])
  console.log('🧹 Cleared users, projects, tasks, and comments')
}

/** Insert a small, realistic set of demo data with proper relationships. */
async function seed(): Promise<void> {
  await clearAll()

  // Users (passwords are hashed by the User pre-save hook).
  // Use create() (not insertMany) so the hashing hook runs.
  const [admin, manager, contributor] = await User.create([
    { name: 'Ada Admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
    { name: 'Max Manager', email: 'manager@example.com', password: 'password123', role: 'manager' },
    { name: 'Cody Contributor', email: 'contributor@example.com', password: 'password123', role: 'contributor' },
  ])
  console.log('👤 Created 3 users (admin@, manager@, contributor@ / password123)')

  // Projects
  const [website, mobile] = await Project.create([
    {
      name: 'Website Redesign',
      description: 'Revamp the marketing site with a new design system.',
      status: 'active',
      owner: manager._id,
      members: [manager._id, contributor._id],
    },
    {
      name: 'Mobile App MVP',
      description: 'Ship the first version of the companion mobile app.',
      status: 'planning',
      owner: admin._id,
      members: [admin._id, contributor._id],
    },
  ])
  console.log('📁 Created 2 projects')

  // Tasks (reference a project and, optionally, an assignee)
  const [heroTask, apiTask, authTask] = await Task.create([
    {
      title: 'Design new hero section',
      description: 'Create a responsive hero with a clear call to action.',
      status: 'in-progress',
      priority: 'high',
      project: website._id,
      assignee: contributor._id,
      tags: ['design', 'frontend'],
    },
    {
      title: 'Integrate CMS API',
      description: 'Wire the marketing pages to the headless CMS.',
      status: 'todo',
      priority: 'medium',
      project: website._id,
      assignee: contributor._id,
      tags: ['backend'],
    },
    {
      title: 'Implement auth flow',
      description: 'Login, registration, and protected routes for the mobile app.',
      status: 'todo',
      priority: 'urgent',
      project: mobile._id,
      assignee: admin._id,
      tags: ['auth', 'mobile'],
    },
  ])
  console.log('✅ Created 3 tasks')

  // Comments (reference a task and an author)
  await Comment.create([
    { body: 'Started on the wireframes — will share by EOD.', task: heroTask._id, author: contributor._id },
    { body: 'Please prioritize mobile breakpoints.', task: heroTask._id, author: manager._id },
    { body: 'Blocked on CMS credentials.', task: apiTask._id, author: contributor._id },
    { body: 'Let’s pair on the token refresh logic tomorrow.', task: authTask._id, author: admin._id },
  ])
  console.log('💬 Created 4 comments')

  console.log('\n🌱 Seed complete.')
}

async function main(): Promise<void> {
  const mode = process.argv[2] === 'clear' ? 'clear' : 'seed'
  await connectDB()
  try {
    if (mode === 'clear') {
      await clearAll()
      console.log('\n🗑️  Database cleared.')
    } else {
      await seed()
    }
  } catch (error) {
    console.error('Seed script failed:', error)
    process.exitCode = 1
  } finally {
    await disconnectDB()
    await mongoose.connection.close()
  }
}

main()
