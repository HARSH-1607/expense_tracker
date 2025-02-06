import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// Register validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

// Login validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register route
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      preferences: {
        theme: 'system',
        defaultCurrency: 'USD',
        notifications: {
          billReminders: true,
          budgetAlerts: true,
          goalProgress: true,
        },
      },
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', loginValidation, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new AppError(info.message || 'Invalid credentials', 401));
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      status: 'success',
      token,
      data: {
        user: userResponse,
      },
    });
  })(req, res, next);
});

// Get current user route
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Remove password from response
    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.json({
      status: 'success',
      data: {
        user: userResponse,
      },
    });
  }
);

export default router; 