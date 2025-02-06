import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';

import { errorHandler } from './middleware/errorHandler';
import { configurePassport } from './config/passport';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import expenseRoutes from './routes/expense.routes';
import savingsRoutes from './routes/savings.routes';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Express configuration
app.set('port', process.env.PORT || 5000);
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure passport
configurePassport(passport);
app.use(passport.initialize());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/savings', savingsRoutes);

// Error handling
app.use(errorHandler);

// Start Express server
app.listen(app.get('port'), () => {
  console.log(
    'Server is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
}); 