import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  amount: number;
  categoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  notes?: string;
  currency: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function (this: IExpense) {
        return this.isRecurring;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ categoryId: 1, date: -1 });

export default mongoose.model<IExpense>('Expense', expenseSchema); 