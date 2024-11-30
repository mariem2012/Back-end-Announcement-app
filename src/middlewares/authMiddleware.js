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



// export const verifyRole = (role) => {
//     return (req, res, next) => {
//         if (req.user.role !== role) {
//             return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
//         }
//         next();
//     };
// };


export const verifyRole = (roles) => {
  return (req, res, next) => {
      if (!req.user) {
          console.log('Utilisateur non authentifié');
          return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      console.log('Rôle utilisateur:', req.user.role);
      if (!roles.includes(req.user.role)) {
          console.log(`Rôle insuffisant: requis ${roles}, actuel ${req.user.role}`);
          return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
      }
      next();
  };
};










