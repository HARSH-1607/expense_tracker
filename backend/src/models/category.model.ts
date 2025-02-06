import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
  userId: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique categories per user
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', categorySchema); 