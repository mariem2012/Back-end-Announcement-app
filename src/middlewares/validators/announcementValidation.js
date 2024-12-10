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


const addAnnouncementValidator = [
  check('title')
  .notEmpty()
  .withMessage('Le titre est requis !')
  .bail()
  .isString()
  .withMessage('Le titre doit être une chaîne de caractères !')
  .bail()
  .isLength({ min: 3 })
  .withMessage('Le titre doit contenir au moins 3 caractères !')
  .bail()
  .isLength({ max: 100 })
  .withMessage('Le titre ne peut pas dépasser 100 caractères !')
  .bail(),
  // .matches(/^(?=.*[A-Za-zÀ-ÖØ-öø-ÿ])([A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*)$/)
  // .withMessage(
  //     'Le titre doit contenir au moins une lettre, peut inclure des chiffres, mais pas de caractères spéciaux ni d’espaces vides.'
  // )
  // .bail(),

    // .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    // .withMessage('Le titre doit contenir des lettres et des chiffres, mais pas uniquement des chiffres !')
    // .matches(/^\S+$/)
    // .withMessage('Le titre ne doit pas contenir d\'espaces vides !'),

  check('description')
    .notEmpty()
    .withMessage('La description est requise !')
    .isString()
    .withMessage('La description doit être une chaîne de caractères !')
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères !')
    .matches(/^(?!\d+$)(?!\s*$).+/)
    .withMessage('La description ne doit pas contenir uniquement des chiffres ou des espaces vides !'),

  check('price')
    .notEmpty()
    .withMessage('Le prix est requis !')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif !'),

  // check('pictures')
  //   .optional()
  //   .isArray()
  //   .withMessage('Les images doivent être un tableau d\'URLs !')
  //   .custom((pictures) =>
  //     pictures.every((picture) =>
  //       /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(picture)
  //     )
  //   )
  //   .withMessage(
  //     'Chaque image doit être une URL valide se terminant par jpg, jpeg ou png !'
  //   ),

  // check('category_id')
  //   .notEmpty()
  //   .withMessage('L\'ID de la catégorie est requis !')
  //   .isInt()
  //   .withMessage('L\'ID de la catégorie doit être un entier valide !')
  //   .custom(async (value) => {
  //     const existingCategory = await prisma.category.findUnique({
  //       where: { id: value },
  //     });
  //     if (!existingCategory) {
  //       throw new Error('L\'ID de la catégorie n\'existe pas !');
  //     }
  //     return true;
  //   }),

  // check('publish_date')
  //   // .notEmpty()
  //   // .withMessage('La date de publication est requise !')
  //   // .isISO8601()
  //   // .withMessage('La date de publication doit être une date valide !'),

  // (req, res, next) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res
  //       .status(StatusCodes.UNPROCESSABLE_ENTITY)
  //       .json({ errors: errors.array() });
  //   }
  //   next();
  // },
   handleValidationErrors
];

const updateAnnouncementValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de l\'annonce est requis !')
    .isInt()
    .withMessage('L\'ID de l\'annonce doit être un entier valide !'),

    check('title')
    .notEmpty()
    .withMessage('Le titre est requis !')
    .bail()
    .isString()
    .withMessage('Le titre doit être une chaîne de caractères !')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Le titre doit contenir au moins 3 caractères !')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Le titre ne peut pas dépasser 100 caractères !')
    .bail(),
    //  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    // .withMessage('Le titre doit contenir des lettres et des chiffres, mais pas uniquement des chiffres !'),
    // .matches(/^\S+$/)
    // .withMessage('Le titre ne doit pas contenir d\'espaces vides !'),
    check('description')
    .notEmpty()
    .withMessage('La description est requise !')
    .isString()
    .withMessage('La description doit être une chaîne de caractères !')
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères !')
    .matches(/^(?!\d+$)(?!\s*$).+/)
    .withMessage('La description ne doit pas contenir uniquement des chiffres ou des espaces vides !'),

  check('price')
    .notEmpty()
    .withMessage('Le prix est requis !')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif !'),

  // check('pictures')
  //   .optional()
  //   .isArray()
  //   .withMessage('Les images doivent être un tableau d\'URLs !')
  //   .custom((pictures) =>
  //     pictures.every((picture) =>
  //       /^https?:\/\/.*\.(jpg|jpeg|png)$/.test(picture)
  //     )
  //   )
  //   .withMessage(
  //     'Chaque image doit être une URL valide se terminant par jpg, jpeg ou png !'
  //   ),

  // check('category_id')
  //   .optional()
  //   .isInt()
  //   .withMessage('L\'ID de la catégorie doit être un entier valide !')
  //   .custom(async (value) => {
  //     const existingCategory = await prisma.category.findUnique({
  //       where: { id: value },
  //     });
  //     if (!existingCategory) {
  //       throw new Error('L\'ID de la catégorie n\'existe pas !');
  //     }
  //     return true;
  //   }),

  check('publish_date')
    .optional()
    .isISO8601()
    .withMessage('La date de publication doit être une date valide !'),

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

const deleteAnnouncementValidator = [
  param('id').isInt().withMessage('L\'ID de l\'annonce doit être un nombre !'),

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
  addAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
};
