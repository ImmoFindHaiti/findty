import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadPhotos(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune photo fournie' });
    }
    if (req.files.length < 5) {
      return res.status(400).json({ success: false, message: 'Minimum 5 photos requises' });
    }
    const { bienId } = req.body;
    const bien = await prisma.bien.findUnique({ where: { id: bienId } });
    if (!bien) return res.status(404).json({ success: false, message: 'Bien introuvable' });

    const urls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'immofind' });
      const photo = await prisma.photo.create({ data: { url: result.secure_url, bienId } });
      urls.push(photo);
    }
    res.status(201).json({ success: true, message: 'Photos uploadées avec succès', data: urls });
  } catch (error) { next(error); }
}

export async function supprimerPhoto(req, res, next) {
  try {
    const photo = await prisma.photo.findUnique({ where: { id: req.params.id } });
    if (!photo) return res.status(404).json({ success: false, message: 'Photo introuvable' });
    const publicId = photo.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`immofind/${publicId}`);
    await prisma.photo.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Photo supprimée' });
  } catch (error) { next(error); }
}
