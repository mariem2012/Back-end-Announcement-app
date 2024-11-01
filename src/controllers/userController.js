import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';

class UserController {
  static async create(req, res) {
    try {
      const { name, email, password, phone, address, role, lat, lng } = req.body;
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password, 
          phone,
          address,
          role,
          lat,
          lng,
          registration_date: new Date(),
        },
      });
      res.status(StatusCodes.CREATED).json({
        message: 'User created successfully!', user
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async getAll(_req, res) {
    try {
      const users = await prisma.user.findMany();
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
      }
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, address, role, lat, lng, status } = req.body;
      const user = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: { name, email, phone, address, role, lat, lng, status },
      });
      res.status(StatusCodes.OK).json({
        message: 'User updated successfully!', user
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: parseInt(id, 10) } });
      res.status(StatusCodes.NO_CONTENT).send({
        message: 'User deleted successfully!'
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export default UserController;
