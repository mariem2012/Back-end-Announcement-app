import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';


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
      const {
        title,
        description,
        price,
        category_id,
        publish_date,
      } = req.body;
  
      // Récupération et décryptage du token utilisateur
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authorization token is missing!' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.userId;
      console.log('Utilisateur récupéré:', user_id);
  
      // Validation des champs requis
      if (!title || !description || !price || !category_id || !publish_date) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Tous les champs obligatoires doivent être remplis!' });
      }
  
      // Validation du prix et de la date
      if (isNaN(price) || Number(price) <= 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Le prix doit être un nombre positif!' });
      }
  
      if (isNaN(Date.parse(publish_date))) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'La date de publication est invalide!' });
      }
  
      // Création de l'annonce dans la base de données
      const announcement = await prisma.announcement.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          status: true,
          publish_date: new Date(publish_date),
          category: { connect: { id: parseInt(category_id) } },
          user: { connect: { id: parseInt(user_id) } },
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
      } = req.body;

      const data = {};
      if (title) data.title = title;
      if (description) data.description = description;
      if (price) data.price = parseFloat(price);
      if (typeof status !== 'undefined') data.status = status;
      if (category_id) data.category = { connect: { id: category_id } };
      if (user_id) data.user = { connect: { id: user_id } };
      if (publish_date) data.publish_date = new Date(publish_date);

      const announcement = await prisma.announcement.update({
        where: { id: parseInt(id, 10) },
        data,
      });

      res.status(StatusCodes.OK).json({
        message: 'Announcement updated successfully!',
        announcement,
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
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
