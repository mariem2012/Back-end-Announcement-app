import { check } from 'express-validator';

export const registerValidator = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  check('name').notEmpty().withMessage('Le nom est requis'),
  check('phone').notEmpty().withMessage('Le téléphone est requis'),
  check('address').notEmpty().withMessage("L'adresse est requise"),
];

export const loginValidator = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password').notEmpty().withMessage('Le mot de passe est requis'),
];
