import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';

class AnnouncementController {
  // vraie code avant ajout de proprietés geographique
  // static async create(req, res) {
  //   try {
  //     const { title, description, price, status, category_id, user_id } = req.body;

  //     const announcement = await prisma.announcement.create({
  //       data: {
  //         title,
  //         description,
  //         price: parseFloat(price),
  //         status,
  //         category: { connect: { id: category_id } },
  //         user: { connect: { id: user_id } }
  //       },
  //     });

  //     res.status(StatusCodes.CREATED).json({
  //       message: 'Announcement created successfully!',
  //       announcement
  //     });
  //   } catch (error) {
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  //   }
  // }

  // Update an existing announcement

  static async create(req, res) {
    try {
        const { title, description, price, category_id, user_id, pictures, latitude, longitude, publication_date } = req.body;

        // Vérifiez que tous les champs nécessaires sont fournis
        if (!title || !description || !price || !category_id || !user_id || latitude === undefined || longitude === undefined || !publication_date) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required!' });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                price,
                status: true,  // Vous pouvez définir un statut par défaut ici
                publication_date: new Date(publication_date),  // Utiliser la date fournie par l'utilisateur
                category: {
                    connect: { id: category_id }
                },
                user: {
                    connect: { id: user_id }
                },
                pictures,
                latitude,
                longitude
            }
        });

        res.status(StatusCodes.CREATED).json({
            message: 'Announcement created successfully!',
            announcement
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, status, category_id, user_id } = req.body;

      const data = {};
      if (title) data.title = title;
      if (description) data.description = description;
      if (price) data.price = parseFloat(price);
      if (typeof status !== 'undefined') data.status = status;

      if (category_id) {
        data.category = { connect: { id: category_id } };
      }
      if (user_id) {
        data.user = { connect: { id: user_id } };
      }

      const announcement = await prisma.announcement.update({
        where: { id: parseInt(id, 10) },
        data
      });

      res.status(StatusCodes.OK).json({
        message: 'Announcement updated successfully!',
        announcement
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // Delete an announcement
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.announcement.delete({
        where: { id: parseInt(id, 10) }
      });
      res.status(StatusCodes.OK

        
      ).json({ message: 'Announcement deleted successfully!' });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // Get a specific announcement by ID
  static async getAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const announcement = await prisma.announcement.findUnique({
        where: { id: parseInt(id, 10) }
      });
      if (!announcement) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Announcement not found!' });
      }
      res.status(StatusCodes.OK).json(announcement);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // Get all announcements with optional filtering by category and user
  static async getAllAnnouncements(req, res) {
    try {
      const { category_id, user_id } = req.query;
      const announcements = await prisma.announcement.findMany({
        where: {
          ...(category_id && { category_id: parseInt(category_id, 10) }),
          ...(user_id && { user_id: parseInt(user_id, 10) })
        }
      });
      res.status(StatusCodes.OK).json(announcements);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export default AnnouncementController;
