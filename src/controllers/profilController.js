// controllers/profileController.js
import prisma from '../config/prisma.js';

// Récupérer les informations du profil
export const getUserProfile = async (req, res) => {
  const { userId } = req.user; // userId extrait du token dans le middleware auth

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Mettre à jour les informations du profil
export const updateUserProfile = async (req, res) => {
  const { userId } = req.user; // userId extrait du token dans le middleware auth
  const { name, phone, address, lat, lng } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        lat,
        lng,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        lat: true,
        lng: true,
        status: true,
        registration_date: true,
      },
    });

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
