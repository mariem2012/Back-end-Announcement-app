// authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import { resetsPassword, sendPasswordResetEmail } from "../services/userService.js";
export const registerUser = async (req, res) => {
  // Validation des données
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extraction des données utilisateur
  const { password, name, email, phone, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        name,
        email,
        phone,
        address,
        role: 'ANNONCEUR',
        registration_date: new Date(),
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Réponse réussie
    return res.status(201).json({
      message: 'Utilisateur inscrit avec succès',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        registration_date: user.registration_date,
      },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      const targetField = err.meta?.target?.[0]; 
      return res.status(400).json({
        message: `Le champ "${targetField}" doit être unique. La valeur fournie est déjà utilisée.`,
      });
    }
    // Gestion générique des erreurs
    console.error('Erreur lors de l\'inscription :', err);
  }
};


export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Vérification si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du statut de l'utilisateur
    if (!user.status) {
      return res.status(403).json({ 
        message: 'Votre compte est bloqué. Veuillez contacter un administrateur.' 
      });
    }

    // Vérification du mot de passe
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Mot de passe incorrect' });
    // }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
      const response = await resetsPassword(token, newPassword);
      res.status(200).json(response);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
}

// Demande de réinitialisation de mot de passe
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
      // Vérifiez si l'email existe dans la base de données
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
          // Si l'email n'existe pas, retournez une erreur
          return res.status(404).json({ message: "L'adresse e-mail n'existe pas." });
      }

      // Envoyer l'email de réinitialisation si l'utilisateur est trouvé
      const response = await sendPasswordResetEmail(email);
      res.status(200).json(response);
  } catch (error) {
    console.error(error)
      res.status(500).json({ message: "Une erreur s'est produite lors du traitement de la demande." });
  }
}



