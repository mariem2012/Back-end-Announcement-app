import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma.js';

const addAnnouncementValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required!')
    .isString()
    .withMessage('Title must be a string!')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long!')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 100 characters long!'),

  check('description')
    .notEmpty()
    .withMessage('Description is required!')
    .isString()
    .withMessage('Description must be a string!')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters!'),

  check('price')
    .notEmpty()
    .withMessage('Price is required!')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number!'),

  check('pictures')
    .optional()
    .isArray()
    .withMessage('Pictures must be an array of URLs!')
    .custom((pictures) =>
      pictures.every((picture) =>
        /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(picture)
      )
    )
    .withMessage(
      'Each picture must be a valid URL ending in jpg, jpeg, or png!'
    ),

  check('category_id')
    .notEmpty()
    .withMessage('Category ID is required!')
    .isInt()
    .withMessage('Category ID must be a valid integer!')
    .custom(async (value) => {
      const existingCategory = await prisma.category.findUnique({
        where: { id: value },
      });
      if (!existingCategory) {
        throw new Error('Category ID does not exist!');
      }
      return true;
    }),

  check('publish_date')
    .notEmpty()
    .withMessage('Publish date is required!')
    .isISO8601()
    .withMessage('Publish date must be a valid date!'),

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

const updateAnnouncementValidator = [
  param('id')
    .notEmpty()
    .withMessage('Announcement ID is required!')
    .isInt()
    .withMessage('Announcement ID must be a valid integer!'),

  check('title')
    .optional()
    .isString()
    .withMessage('Title must be a string!')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long!')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 100 characters long!'),

  check('description')
    .optional()
    .isString()
    .withMessage('Description must be a string!')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters!'),

  check('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number!'),

  check('pictures')
    .optional()
    .isArray()
    .withMessage('Pictures must be an array of URLs!')
    .custom((pictures) =>
      pictures.every((picture) =>
        /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(picture)
      )
    )
    .withMessage(
      'Each picture must be a valid URL ending in jpg, jpeg, or png!'
    ),

  check('category_id')
    .optional()
    .isInt()
    .withMessage('Category ID must be a valid integer!')
    .custom(async (value) => {
      const existingCategory = await prisma.category.findUnique({
        where: { id: value },
      });
      if (!existingCategory) {
        throw new Error('Category ID does not exist!');
      }
      return true;
    }),

  check('publish_date')
    .optional()
    .isISO8601()
    .withMessage('Publish date must be a valid date!'),

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

const deleteAnnouncementValidator = [
  param('id').isInt().withMessage('Announcement ID must be a number!'),

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

export {
  addAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
};
