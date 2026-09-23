import { Schema, model, Document, Model, Types } from 'mongoose'

export interface IComment extends Document {
  _id: Types.ObjectId
  body: string
  task: Types.ObjectId // ref Task
  author: Types.ObjectId // ref User
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    body: {
      type: String,
      required: [true, 'Comment body is required'],
      trim: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'A comment must belong to a task'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an author'],
    },
  },
  { timestamps: true }
)

export const Comment: Model<IComment> = model<IComment>('Comment', commentSchema)
