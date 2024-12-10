import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {


    return res.status(400).json({ errors: errors.array() });

  }

  next(); 
};

export const registerValidator = [
  check('email')
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage('Email invalide')
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé.');
      }
    }),
  check('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
  check('name')
    .notEmpty().withMessage('Le nom est requis')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
    .withMessage('Le nom ne doit contenir que des lettres et des espaces valides'),  
  check('phone')
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^\d{2}(\s\d{2}){3}$/).withMessage('Le numéro de téléphone doit contenir exactement 8 chiffres, avec ou sans espaces'),
    check('address')
    .notEmpty().withMessage("L'adresse est requise")
    .matches(/^[A-Za-z0-9\s\-\.\#\,]+$/).withMessage("L'adresse ne doit contenir que des lettres, des chiffres, des espaces et certains caractères spéciaux autorisés (-, ., #, ,)")
    .isLength({ max: 100 }).withMessage("L'adresse ne doit pas dépasser 100 caractères.")
    .not().matches(/^\d+$/).withMessage("L'adresse ne doit pas être uniquement composée de chiffres."),
    handleValidationErrors
];


export const loginValidator = [
  check('email')
  .notEmpty().withMessage("L'email est requis") 
  .isEmail().withMessage('Email invalide') 
  .normalizeEmail(),
  check('password')
  .notEmpty().withMessage('Le mot de passe est requis')
  .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  // .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
  // .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
  // .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
  // .matches(/[\W]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
  // .custom(async (password) => {
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   return res.status(400).json({ message: 'Mot de passe incorrect' });
  // }
  // } ),

  handleValidationErrors
];
