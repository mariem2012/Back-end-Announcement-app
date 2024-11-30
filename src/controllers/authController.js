// authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';

export const registerUser = async (req, res) => {
  // Validation des données
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extraction des données utilisateur
  const { password, name, email, phone, address } = req.body;

  try {
    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

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
  }
};


