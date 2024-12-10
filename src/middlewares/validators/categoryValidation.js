import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma.js';
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {


    return res.status(400).json({ errors: errors.array() });

  }

  next(); 
};

const addCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required!')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long!')
    .withMessage('Name must be a string!')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long!')
    .withMessage('Name must be at most 100 characters long!')
    .matches(/^[a-zA-ZÀ-ÿ\s'’-]+$/)
    .withMessage("Le nom de la catégorie ne peut pas contenir de chiffres !")    
    .custom(async (value) => {
      const existingCategory = await prisma.category.findUnique({
        where: { name: value },
      });
      if (existingCategory) {
        throw new Error('Le nom de la catégorie est unique!');
      }
      return true;
    }),

    check('user_id')
    .optional()
    .isInt()
    .withMessage('User ID must be a valid integer!'),


  check('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean (true or false)!'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
  handleValidationErrors
];

const updateCategoryValidator = [
  param('id')
    .notEmpty()
    .withMessage('Category ID is required!')
    .isInt()
    .withMessage('Category ID must be a valid integer!'),

  check('name')
    .notEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage('Name must be a string!')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long!')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long!')
    .matches(/^[a-zA-ZÀ-ÿ\s'’-]+$/)
    .withMessage("Le nom de la catégorie ne peut pas contenir de chiffres !")    
    .custom(async (value, { req }) => {
      const categoryId = parseInt(req.params.id, 10);
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: value,
          NOT: { id: categoryId },
        },
      });
      if (existingCategory) {
        throw new Error('Le nom de la catégorie est unique!');
      }
      return true;
    }),

  check('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean (true or false)!'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
  handleValidationErrors
];

const deleteCategoryValidator = [
  param('id').isInt().withMessage('ID must be a number!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
  handleValidationErrors
];

export {
  addCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
