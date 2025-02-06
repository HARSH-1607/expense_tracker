import mongoose, { Document, Schema } from 'mongoose';

export interface ISavingsGoal extends Document {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  currency: string;
  userId: mongoose.Types.ObjectId;
}

const savingsGoalSchema = new Schema<ISavingsGoal>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
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

// Create index for better query performance
savingsGoalSchema.index({ userId: 1 });

// Add validation to ensure currentAmount doesn't exceed targetAmount
savingsGoalSchema.pre('save', function (next) {
  if (this.currentAmount > this.targetAmount) {
    this.currentAmount = this.targetAmount;
  }
  next();
});

export default mongoose.model<ISavingsGoal>('SavingsGoal', savingsGoalSchema); 