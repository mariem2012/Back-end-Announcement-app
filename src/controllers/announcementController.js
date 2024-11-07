import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';

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

 

class AnnouncementController {
  
  static async create(req, res) {
    try {
      const { title, description, price, category_id, user_id, picture, publish_date } = req.body;

      if (!title || !description || !price || !category_id || !user_id || !publish_date) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required!' });
      }

      const announcement = await prisma.announcement.create({
        data: {
          title,
          description,
          price,
          status: true,  
          publish_date: new Date(publish_date),
          category: { connect: { id: category_id } },
          user: { connect: { id: user_id } },
          picture,  
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: 'Announcement created successfully!',
        announcement,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, status, category_id, user_id, publish_date } = req.body;

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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.announcement.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(StatusCodes.OK).json({ message: 'Announcement deleted successfully!' });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async getAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const announcement = await prisma.announcement.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!announcement) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Announcement not found!' });
      }
      res.status(StatusCodes.OK).json(announcement);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export default AnnouncementController;
