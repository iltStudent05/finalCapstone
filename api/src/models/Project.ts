import { Schema, model, Document, Model, Types } from 'mongoose'

/** Lifecycle states a project can be in. */
export const PROJECT_STATUSES = ['planning', 'active', 'on-hold', 'completed'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export interface IProject extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  status: ProjectStatus
  owner: Types.ObjectId // ref User
  members: Types.ObjectId[] // ref User
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'planning',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A project must have an owner'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

export const Project: Model<IProject> = model<IProject>('Project', projectSchema)
