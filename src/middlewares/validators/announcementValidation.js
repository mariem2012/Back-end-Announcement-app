import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma.js';

// Validation pour créer une annonce
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

  check('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array of URLs!')
    .custom((photos) => photos.every(photo => /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(photo)))
    .withMessage('Each photo must be a valid URL ending in jpg, jpeg, or png!'),

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

  check('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90.'),

  check('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180.'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation pour mettre à jour une annonce
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

  check('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array of URLs!')
    .custom((photos) => photos.every(photo => /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(photo)))
    .withMessage('Each photo must be a valid URL ending in jpg, jpeg, or png!'),

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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation pour supprimer une annonce
const deleteAnnouncementValidator = [
  param('id')
    .isInt()
    .withMessage('Announcement ID must be a number!'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
  },
];

export {
  addAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator
};
