// import { StatusCodes } from 'http-status-codes';
// import prisma from '../config/prisma.js';

// class UserController {
//   static async create(req, res) {
//     try {
//       const { name, email, password, phone, address, role, lat, lng } =
//         req.body;
//       const user = await prisma.user.create({
//         data: {
//           name,
//           email,
//           password,
//           phone,
//           address,
//           role,
//           lat,
//           lng,
//           registration_date: new Date(),
//         },
//       });
//       res.status(StatusCodes.CREATED).json({
//         message: 'User created successfully!',
//         user,
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async getAll(_req, res) {
//     try {
//       const users = await prisma.user.findMany();
//       res.status(StatusCodes.OK).json(users);
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async getById(req, res) {
//     try {
//       const { id } = req.params;
//       const user = await prisma.user.findUnique({
//         where: { id: parseInt(id, 10) },
//       });
//       if (!user) {
//         return res
//           .status(StatusCodes.NOT_FOUND)
//           .json({ error: 'User not found' });
//       }
//       res.status(StatusCodes.OK).json(user);
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async update(req, res) {
//     try {
//       const { id } = req.params;
//       const { name, email, phone, address, role, lat, lng, status } = req.body;
//       const user = await prisma.user.update({
//         where: { id: parseInt(id, 10) },
//         data: { name, email, phone, address, role, lat, lng, status },
//       });
//       res.status(StatusCodes.OK).json({
//         message: 'User updated successfully!',
//         user,
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async delete(req, res) {
//     try {
//       const { id } = req.params;
//       await prisma.user.delete({ where: { id: parseInt(id, 10) } });
//       res.status(StatusCodes.NO_CONTENT).send({
//         message: 'User deleted successfully!',
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }
// }

// export default UserController;


// import { StatusCodes } from 'http-status-codes';
// import prisma from '../config/prisma.js';

// import bcrypt from 'bcryptjs';

// class UserController {
//   static async create(req, res) {
//     try {
//       const { name, email, password, phone, address, role, lat, lng } =
//         req.body;
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = await prisma.user.create({
//         data: {
//           name,
//           email,
//           password: hashedPassword,
//           phone,
//           address,
//           role,
//           lat,
//           lng,
//           registration_date: new Date(),
//         },
//       });
//       res.status(StatusCodes.CREATED).json({
//         message: 'User created successfully!',
//         user,
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }


//   static async getAll(_req, res) {
//     try {
//       const users = await prisma.user.findMany();
//       const usersWithStatusText = users.map(({ password, ...user }) => ({
//         ...user,
//         status: user.status ? "Actif" : "Inactif", // Conversion du statut en texte
//       }));
  
//       res.status(StatusCodes.OK).json(usersWithStatusText);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }
  

//   static async getById(req, res) {
//     try {
//       const { id } = req.params;
//       const user = await prisma.user.findUnique({
//         where: { id: parseInt(id, 10) },
//       });
//       if (!user) {
//         return res
//           .status(StatusCodes.NOT_FOUND)
//           .json({ error: 'User not found' });
//       }
//       res.status(StatusCodes.OK).json(user);
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async update(req, res) {
//     try {
//       const { id } = req.params;
//       const { name, email, phone, address, role, lat, lng, status } = req.body;
//       const user = await prisma.user.update({
//         where: { id: parseInt(id, 10) },
//         data: { name, email, phone, address, role, lat, lng, status },
//       });
//       res.status(StatusCodes.OK).json({
//         message: 'User updated successfully!',
//         user,
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async delete(req, res) {
//     try {
//       const announcement = await prisma.announcement.findUnique({
//         where: { id: announcementId },
//       });
  
//       if (!announcement) {
//         return { message: 'Announcement not found.' };
//       }
  
//       const { id } = req.params;
//       await prisma.user.delete({ where: { id: parseInt(id, 10) } });
//       res.status(StatusCodes.NO_CONTENT).send({
//         message: 'User deleted successfully!',
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   // static async getCurrentUser(req, res) {
//   //   try {
//   //     const userId = req.user.id;
//   //     const user = await prisma.user.findUnique({
//   //       where: { id: userId },
//   //     });

//   //     if (user) {
//   //       res.json({ user });
//   //     } else {
//   //       res.status(404).json({ message: 'Utilisateur non trouvé' });
//   //     }
//   //   } catch (error) {
//   //     res.status(500).json({ error: 'Erreur serveur' });
//   //   }
//   // }
// }

// export default UserController;
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

class UserController {
  static async create(req, res) {
    try {
      const { name, email, password, phone, address, role, lat, lng } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          role,
          lat,
          lng,
          registration_date: new Date(),
        },
      });

      const { password: _, ...userWithoutPassword } = user;

        res.status(StatusCodes.CREATED).json({
            message: 'User created successfully!',
            user: userWithoutPassword, 
        });
        
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(StatusCodes.CONFLICT).json({
          error: 'Email or phone already exists!',
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async getAll(_req, res) {
    try {
      const users = await prisma.user.findMany();
      const usersWithStatusText = users.map(({ password, ...user }) => ({
        ...user,
        status: user.status ? 'Actif' : 'Inactif',
      }));

      res.status(StatusCodes.OK).json(usersWithStatusText);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found!' });
      }

      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: `User with ID ${req.params.id} does not exist!`,
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, address, role, lat, lng, status, password } = req.body;

      const data = { name, email, phone, address, role, lat, lng, status };

      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data,
      });

      res.status(StatusCodes.OK).json({
        message: 'User updated successfully!',
        user,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: `User with ID ${req.params.id} does not exist!`,
        });
      }
      if (error.code === 'P2002') {
        return res.status(StatusCodes.CONFLICT).json({
          error: 'Email or phone must be unique!',
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
  
      // Vérification si l'utilisateur existe avant suppression
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
      });
  
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: `User with ID ${id} does not exist!`,
        });
      }
  
      // Suppression de l'utilisateur
      await prisma.user.delete({
        where: { id: parseInt(id, 10) },
      });
  
      // Réponse explicite avec un message
      res.status(StatusCodes.OK).json({
        message: `User with ID ${id} deleted successfully!`,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }
  

  static async changePassword(req, res) {
    const userId = req.user.userId; // ID de l'utilisateur (paramètre d'URL)
    const { currentPassword, newPassword } = req.body; // Mot de passe actuel et nouveau mot de passe
  
    try {
      // Validation des entrées
      if (!currentPassword || !newPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Les champs 'currentPassword' et 'newPassword' sont obligatoires.",
        });
      }
  
      // Vérifier l'existence de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });
  
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Utilisateur non trouvé.",
        });
      }
  
      // Vérification du mot de passe actuel
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Le mot de passe actuel est incorrect.",
        });
      }
  
      // Générer un nouveau mot de passe haché
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { password: hashedPassword },
      });
  
      // Réponse en cas de succès
      return res.status(StatusCodes.OK).json({
        message: "Mot de passe mis à jour avec succès.",
      });
    } catch (error) {
      // Gérer les erreurs inattendues
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Une erreur est survenue lors de la mise à jour du mot de passe.",
        details: error.message,
      });
    }
  }
  

}


export default UserController;
