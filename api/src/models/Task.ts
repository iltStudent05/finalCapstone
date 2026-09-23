import { Schema, model, Document, Model, Types } from 'mongoose'

export const TASK_STATUSES = ['todo', 'in-progress', 'review', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface ITask extends Document {
  _id: Types.ObjectId
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project: Types.ObjectId // ref Project (references another domain model)
  assignee?: Types.ObjectId // ref User
  dueDate?: Date
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'medium',
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'A task must belong to a project'],
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export const Task: Model<ITask> = model<ITask>('Task', taskSchema)
