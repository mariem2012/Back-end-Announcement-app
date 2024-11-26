import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    req.user = { userId: decoded.id, role: decoded.role }; 
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};


export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token manquant' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token invalide' });
      req.user = decoded;
      next();
  });
};



export const verifyRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
        }
        next();
    };
};

// export const checkRole = (allowedRoles) => {
//   return (req, res, next) => {
//     const user = req.user; 
//     if (!user) {
//       return res.status(401).json({ message: "Non autorisé" });
//     }
//     if (!allowedRoles.includes(user.role)) {
//       return res.status(403).json({ message: "Accès refusé" });
//     }
//     next();
//   };
// };







// export const isOwnerOrAdmin = async (req, res, next) => {
//   try {
//     const user = req.user; // Utilisateur connecté
//     const announcement = await Announcement.findById(req.params.id);
//     if (!announcement) {
//       return res.status(404).json({ message: "Annonce non trouvée" });
//     }

//     // Vérifie si l'utilisateur est propriétaire ou admin
//     if (announcement.userId.toString() !== user.id && user.role !== 'ADMIN') {
//       return res.status(403).json({ message: "Accès refusé" });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };
