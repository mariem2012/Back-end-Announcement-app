import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma.js';

const addUserValidator = [
  check('name')
    .notEmpty().withMessage('Name is required!')
    .isString().withMessage("Name can't be a number!")
    .bail()
    .isLength({ min: 6 })
    .withMessage('Name must be at most 6 characters long!')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long!')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can't contain numbers or special characters!"),

  check('email')
    .notEmpty().withMessage('Email is required!')
    .isEmail().withMessage('Invalid email format!')
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error('Email already exists!');
      }
      return true;
    }),


  check('password')
    .notEmpty().withMessage('Password is required!')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long!'),

  check('phone')
    .optional()
    .isString().withMessage('Phone must be a string!')
    .isLength({ max: 50 }).withMessage('Phone must be at most 50 characters long!')
    .custom(async (value) => {
      if (value) {
        const existingUser = await prisma.user.findUnique({
          where: { phone: value },
        });
        if (existingUser) {
          throw new Error('Phone number already exists!');
        }
      }
      return true;
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json({ errors: errors.array() });
      next();
    },
];

const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('Id is required!')
    .isInt()
    .withMessage('Id must be a number!'),

  check('name')
    .notEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage("Name must be a string!")
    .isLength({ min: 6 })
    .withMessage('Name must be at most 6 characters long!')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long!')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can't contain numbers or special characters!"),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format!')
    .custom(async (value, { req }) => {
      const userId = parseInt(req.params.id, 10);
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email must be unique!');
      }
      return true;
    }),

  check('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long!'),

  check('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string!')
    .isLength({ max: 50 })
    .withMessage('Phone must be at most 50 characters long!')
    .custom(async (value, { req }) => {
      const userId = parseInt(req.params.id, 10);
      const existingUser = await prisma.user.findUnique({
        where: { phone: value },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Phone must be unique!');
      }
      return true;
    }),

  check('address')
    .isString()
    .withMessage('Address must be a string!')
    .isLength({ max: 100 })
    .withMessage('Address must be at most 100 characters long!'),

  check('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value (true or false)!'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
];



const deleteUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('Id is required!')
    .isInt()
    .withMessage('Id must be a number!')
    .custom(async (value) => {
      const userId = parseInt(value);
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found!');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  },
];

export { addUserValidator, updateUserValidator, deleteUserValidator };
