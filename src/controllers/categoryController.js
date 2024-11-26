// import { StatusCodes } from 'http-status-codes';
// import prisma from '../config/prisma.js';

// class CategoryController {
//   static async create(req, res) {
//     try {
//       const { name, status, user_id } = req.body;
//       const category = await prisma.category.create({
//         data: {
//           name,
//           status,
//           // user: {
//           //   connect: { id: user_id },
//           // },
//         },
//       });

//       res.status(StatusCodes.CREATED).json({
//         message: 'Category created successfully',
//         category,
//       });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async getAll(req, res) {
//     try {
//       const categories = await prisma.category.findMany();
//       res.status(StatusCodes.OK).json(categories);
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }

//   static async getById(req, res) {
//     try {
//       const { id } = req.params;

//       // Vérifiez si l'id est bien défini
//       if (!id) {
//         return res.status(400).json({ error: 'Category ID is required!' });
//       }

//       const category = await prisma.category.findUnique({
//         where: { id: parseInt(id, 10) },
//       });

//       if (!category) {
//         return res.status(404).json({ error: 'Category not found!' });
//       }

//       res.status(200).json(category);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async update(req, res) {
//     try {
//       const { id } = req.params;
//       const { name, status, user_id } = req.body;

//       const data = { name, status };

//       if (user_id) {
//         data.user = { connect: { id: parseInt(user_id, 10) } };
//       }

//       const category = await prisma.category.update({
//         where: { id: parseInt(id, 10) },
//         data,
//       });

//       res.status(StatusCodes.OK).json({
//         message: 'Category updated successfully!',
//         category,
//       });
//     } catch (error) {
      
//       if (error.code === 'P2002') {
//         return res
//           .status(StatusCodes.CONFLICT)
//           .json({ error: 'Category name must be unique!' });
//       }
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }


//   static async delete(req, res) {
//     try {
//       const { id } = req.params;
//       await prisma.category.delete({
//         where: { id: parseInt(id, 10) },
//       });
//       res
//         .status(StatusCodes.OK)
//         .json({ message: 'Category deleted successfully!' });
//     } catch (error) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: error.message });
//     }
//   }
// }

// export default CategoryController;
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';

class CategoryController {
  static async create(req, res) {
    try {
      const { name, status, user_id } = req.body;

      const category = await prisma.category.create({
        data: {
          name,
          status,
          user: user_id ? { connect: { id: parseInt(user_id, 10) } } : undefined,
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: 'Category created successfully!',
        category,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'Category name must be unique!' });
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const categories = await prisma.category.findMany();
      res.status(StatusCodes.OK).json(categories);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!category) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Category with ID ${id} not found!` });
      }

      res.status(StatusCodes.OK).json(category);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params; // Assurez-vous que l'ID est bien extrait
      const { name, status, user_id } = req.body;
  
      const data = {};
      if (name) data.name = name;
      if (status !== undefined) data.status = status;
  
      if (user_id) {
        const userExists = await prisma.user.findUnique({
          where: { id: parseInt(user_id, 10) },
        });
        if (!userExists) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `User with ID ${user_id} does not exist.` });
        }
        data.user = { connect: { id: parseInt(user_id, 10) } };
      }
  
      const category = await prisma.category.update({
        where: { id: parseInt(id, 10) },
        data,
      });
  
      res.status(StatusCodes.OK).json({
        message: 'Category updated successfully!',
        category,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // Si l'ID de la catégorie n'existe pas
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Category with ID ${req.params.id} does not exist.` });
      }
      if (error.code === 'P2002') {
        // Si le nom de la catégorie est déjà pris
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'Category name must be unique!' });
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  

  static async delete(req, res) {
    const { id } = req.params;
    try {

      await prisma.category.delete({
        where: { id: parseInt(id, 10) },
      });

      res
        .status(StatusCodes.OK)
        .json({ message: 'Category deleted successfully!' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Category with ID ${id} does not exist.` });
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}

export default CategoryController;
