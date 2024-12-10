import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import expressFileUpload from 'express-fileupload';


class AnnouncementController {
  // static async create(req, res) {
  //   try {
  //     // Extraction des données de la requête
  //     const { title, description, price, category_id, publish_date } = req.body;

  //     // Vérifier et décoder le token
  //     const token = req.header('Authorization')?.replace('Bearer ', '');
  //     if (!token) {
  //       return res
  //         .status(StatusCodes.UNAUTHORIZED)
  //         .json({ error: 'Authorization token missing!' });
  //     }

  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const user_id = decoded.userId;

  //     // Vérification des champs obligatoires
  //     if (!title || !description || !price || !category_id || !publish_date) {
  //       return res
  //         .status(StatusCodes.BAD_REQUEST)
  //         .json({ error: 'All fields are required!' });
  //     }

  //     // Gestion des images uploadées
  //     const imagePaths = [];
  //     if (req.files) {
  //       for (const key in req.files) {
  //         const file = req.files[key];
  //         const imageName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
  //         const uploadPath = path.join('uploads', imageName);

  //         // Déplacer le fichier dans le dossier uploads
  //         await file.mv(uploadPath);
  //         imagePaths.push(`/uploads/${imageName}`); // URL relative
  //       }
  //     }

  //     // Création de l'annonce avec Prisma
  //     const announcement = await prisma.announcement.create({
  //       data: {
  //         title,
  //         description,
  //         price: parseFloat(price),
  //         publish_date: new Date(publish_date),
  //         status: true,
  //         category: { connect: { id: parseInt(category_id) } },
  //         user: { connect: { id: user_id } },
  //         picture: imagePaths, // Tableau d'images
  //       },
  //     });

  //     res.status(StatusCodes.CREATED).json({
  //       message: 'Announcement created successfully!',
  //       announcement,
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors de la création de l’annonce :', error);
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  //   }
  // }


  static async create(req, res) {
    try {
      const { title, description, price, picture, category_id, publish_date } = req.body;

      // Récupération et décryptage du token utilisateur
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authorization token is missing!' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.userId;

      // Validation des champs requis
      if (!title || !description || !price || !category_id || !publish_date) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Tous les champs obligatoires doivent être remplis!' });
      }

      // Validation du prix
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Le prix doit être un nombre positif!' });
      }

      // Validation de la date
      const parsedDate = new Date(publish_date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'La date de publication est invalide!' });
      }

      // Validation de la catégorie
      const categoryExists = await prisma.category.findUnique({
        where: { id: parseInt(category_id) },
      });
      if (!categoryExists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'La catégorie spécifiée est introuvable!' });
      }

      // Validation de l'utilisateur
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      });
      if (!userExists) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Utilisateur non autorisé ou introuvable!' });
      }

      // Création de l'annonce dans la base de données avec Prisma
      const announcement = await prisma.announcement.create({
        data: {
          title,
          description,
          price: parsedPrice,
          status: true, // Assume que l'annonce est active à la création
          publish_date: parsedDate,
          category: { connect: { id: parseInt(category_id) } },
          user: { connect: { id: parseInt(user_id) } },
          picture, // Suppose que `picture` est un champ textuel ou optionnel
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: 'Annonce créée avec succès!',
        announcement,
      });

      console.log('Données reçues pour la création:', req.body);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Une erreur est survenue lors de la création de l\'annonce.' });
    }
  }
  // static async create(req, res) {
  //   try {
  //     const { title, price, description, category_id, user_id } = req.body;
  //     const files = req.files?.uploads; // Les fichiers sont supposés être envoyés avec le nom 'uploads'
  //     const uploadedFiles = req.files?.images;
  //     const images = Array.isArray(uploadedFiles) ? uploadedFiles : uploadedFiles ? [uploadedFiles] : [];
  //     // Vérifiez que des fichiers ont été envoyés
  //     if (!files || files.length === 0) {
  //       return res.status(400).json({ message: 'No files uploaded.' });
  //     }

  //     // Collection de chemins d'image
  //     const imagePaths = [];

  //     // Validation et enregistrement des chemins d'images
  //     for (let file of files) {
  //       const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  //       const ext = file.name.split('.').pop().toLowerCase();

  //       if (!allowedExtensions.includes(ext)) {
  //         return res.status(400).json({ message: `Invalid file type: ${ext}` });
  //       }

  //       // Nettoyage du nom de fichier et ajout d'un timestamp
  //       const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  //       const imageName = `${Date.now()}_${sanitizedFilename}`;
  //       const uploadPath = path.join(__dirname, 'uploads', imageName);

  //       // Déplacer le fichier vers le dossier final
  //       await file.mv(uploadPath);

  //       // Ajouter le chemin de l'image à la liste
  //       imagePaths.push(`http://localhost:3500/uploads/${imageName}`);
  //     }

  //     // Créer l'annonce avec les chemins d'image
  //     const announcement = await prisma.announcement.create({
  //       data: {
  //         title,
  //         price,
  //         description,
  //         category_id: parseInt(category_id),
  //         user_id: parseInt(user_id),
  //         picture: imagePaths, // Stocke les chemins des images dans la base de données
  //       },
  //     });

  //     res.status(201).json({
  //       success: true,
  //       message: 'Announcement created successfully.',
  //       announcement,
  //     });
  //   } catch (error) {
  //     console.error('Error creating announcement:', error);
  //     res.status(500).json({ message: 'Failed to create announcement.', error: error.message });
  //   }
  // }
  


  static async update(req, res) {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            status,
            category_id,
            user_id,
            publish_date,
            picture,
        } = req.body;

        // Vérification des champs fournis
        const data = {};
        if (title) data.title = title;
        if (description) data.description = description;
        if (price) data.price = parseFloat(price);
        if (typeof status !== 'undefined') data.status = status;
        if (category_id) data.category = { connect: { id: parseInt(category_id, 10) } };
        if (user_id) data.user = { connect: { id: parseInt(user_id, 10) } };
        if (publish_date) data.publish_date = new Date(publish_date);
        if (picture) {
            if (Array.isArray(picture)) {
                data.picture = picture;
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Picture must be an array of strings.",
                });
            }
        }

        // Mise à jour dans la base de données
        const announcement = await prisma.announcement.update({
            where: { id: parseInt(id, 10) },
            data,
        });

        res.status(StatusCodes.OK).json({
            message: 'Announcement updated successfully!',
            announcement,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.announcement.delete({
        where: { id: parseInt(id, 10) },
      });
      res
        .status(StatusCodes.OK)
        .json({ message: 'Announcement deleted successfully!' });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async getAnnouncementById(req, res) {
    try {
      const { id } = req.params;
      const announcement = await prisma.announcement.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          user: {
            select:{
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            }
          },
          category:{
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        },
      });
      if (!announcement) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Announcement not found!' });
      }
      res.status(StatusCodes.OK).json(announcement);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async getAnnouncementByUserId(req, res) {
    try {
      const { id } = req.params;
      const announcements = await prisma.announcement.findMany({
        where: { user_id: parseInt(id, 10) }, 
        include: {
          user: true, 
          category: true, 
        },
      });
  
      if (announcements.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'No announcements found for this user!' });
      }
  
      res.status(StatusCodes.OK).json(announcements);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  

  static async getAllAnnouncements(req, res) {
    try {
      const { category_id, user_id } = req.query;
      const announcements = await prisma.announcement.findMany({
        where: {
          ...(category_id && { category_id: parseInt(category_id, 10) }),
          ...(user_id && { user_id: parseInt(user_id, 10) }),
        },
      });
      res.status(StatusCodes.OK).json(announcements);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}

export default AnnouncementController;
