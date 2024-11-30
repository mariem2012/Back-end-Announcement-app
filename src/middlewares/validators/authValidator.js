import { check } from 'express-validator';

export const registerValidator = [
  check('email')
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage('Email invalide'),
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
    .matches(/^[A-Za-z0-9\s\-\.\#\,]+$/)
    .withMessage("L'adresse ne doit contenir que des lettres, des chiffres, des espaces et certains caractères spéciaux autorisés (-, ., #, ,)"),
  
];


export const loginValidator = [
  check('email')
  .notEmpty().withMessage("L'email est requis") 
  .isEmail().withMessage('Email invalide') 
  .normalizeEmail(),
  check('password')
  .notEmpty().withMessage('Le mot de passe est requis')
  .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
  // .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
  // .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
  // .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
  // .matches(/[\W]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
];
