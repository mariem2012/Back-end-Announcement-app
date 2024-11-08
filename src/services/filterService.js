// import prisma from '../prismaClient';

// const filterService = {
//   filterAnnouncements: async (filters) => {
//     const { category, minPrice, maxPrice, userId, lat, lng, maxDistance } = filters;
//     const where = {};

//     if (category) where.categoryId = category;
//     if (minPrice || maxPrice) where.price = { gte: minPrice || 0, lte: maxPrice || 999999 };
//     if (userId) where.userId = userId;

//     let announcements = await prisma.announcement.findMany({ where });

//     if (lat && lng && maxDistance) {
//       announcements = announcements.filter((announcement) => {
//         const distance = geoService.calculateDistance(lat, lng, announcement.lat, announcement.lng);
//         return distance <= maxDistance;
//       });
//     }

//     return announcements;
//   }
// };

// module.exports = filterService;
