import { Schema, model, Document, Model, Types } from 'mongoose'
import bcrypt from 'bcrypt'

/** Roles supported by the application, ordered from most to least privileged. */
export const USER_ROLES = ['admin', 'manager', 'contributor'] as const
export type UserRole = (typeof USER_ROLES)[number]

/** Shape of a User document, including the instance method(s). */
export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const SALT_ROUNDS = 10

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'A valid email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned by default queries
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'contributor',
    },
  },
  { timestamps: true }
)

/** Hash the password with bcrypt whenever it is set or changed. */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next()
    return
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/** Compare a plaintext candidate against the stored bcrypt hash. */
userSchema.methods.comparePassword = function comparePassword(
  this: IUser,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

export const User: Model<IUser> = model<IUser>('User', userSchema)
