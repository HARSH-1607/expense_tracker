import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profilePhoto?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    defaultCurrency: string;
    notifications: {
      billReminders: boolean;
      budgetAlerts: boolean;
      goalProgress: boolean;
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    bio: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      defaultCurrency: {
        type: String,
        default: 'USD',
      },
      notifications: {
        billReminders: {
          type: Boolean,
          default: true,
        },
        budgetAlerts: {
          type: Boolean,
          default: true,
        },
        goalProgress: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 