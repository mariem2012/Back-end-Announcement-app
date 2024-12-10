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
const addUserValidator = [
  check('name')
  .notEmpty()
  .withMessage('Le nom est obligatoire !')
  .isString()
  .withMessage('Le nom doit être une chaîne de caractères !')
  .isLength({ min: 3, max: 100 })
  .withMessage('Le nom doit contenir entre 3 et 100 caractères.')
  .matches(/^[^\d\s]+$/)
  .withMessage('Le nom ne doit contenir ni chiffres ni espaces.'),

check('email')
  .notEmpty()
  .withMessage('L\'adresse email est obligatoire !')
  .isEmail()
  .withMessage('Veuillez fournir une adresse email valide.')
  .custom(async (email) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé.');
    }
  }),

check('password')
  .notEmpty()
  .withMessage('Le mot de passe est obligatoire !')
  .isLength({ min: 6 })
  .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  // .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
  // .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
  // .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
  // .matches(/[\W]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),

  check('address')
  .notEmpty().withMessage("L'adresse est requise")
  .matches(/^[A-Za-z0-9\s\-\.\#\,]+$/).withMessage("L'adresse ne doit contenir que des lettres, des chiffres, des espaces et certains caractères spéciaux autorisés (-, ., #, ,)")
  .isLength({ max: 100 }).withMessage("L'adresse ne doit pas dépasser 100 caractères.")
  .not().matches(/^\d+$/).withMessage("L'adresse ne doit pas être uniquement composée de chiffres."),

  check('phone')
    .notEmpty()
    .withMessage('Le numéro de téléphone est obligatoire !')
    .isNumeric()
    .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres.')
    .isLength({ min: 8, max: 8 })
    .withMessage('Le numéro de téléphone doit contenir exactement 8 chiffres.')
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
   handleValidationErrors 

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
    .withMessage('Name must be a string!')
    .isLength({ min: 3 })
    .withMessage('Name must be at most 3 characters long!')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long!')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can't contain numbers or special characters!"),

    check('email')
    .notEmpty().withMessage("L'email est requis") 
    .isEmail().withMessage('Email invalide') 
    .normalizeEmail()
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


    check('address')
    .notEmpty().withMessage("L'adresse est requise")
    .matches(/^[A-Za-z0-9\s\-\.\#\,]+$/).withMessage("L'adresse ne doit contenir que des lettres, des chiffres, des espaces et certains caractères spéciaux autorisés (-, ., #, ,)")
    .isLength({ max: 100 }).withMessage("L'adresse ne doit pas dépasser 100 caractères.")
    .not().matches(/^\d+$/).withMessage("L'adresse ne doit pas être uniquement composée de chiffres."),
  

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
  handleValidationErrors 

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
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
  handleValidationErrors 

];

export { addUserValidator, updateUserValidator, deleteUserValidator };
