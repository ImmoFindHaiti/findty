import { prisma } from '../index.js';

export async function ajouterFavori(req, res, next) {
  try {
    const existant = await prisma.favori.findFirst({
      where: { userId: req.user.id, annonceId: req.params.annonceId }
    });
    if (existant) return res.status(409).json({ success: false, message: 'Déjà dans vos favoris' });
    const favori = await prisma.favori.create({
      data: { userId: req.user.id, annonceId: req.params.annonceId }
    });
    res.status(201).json({ success: true, message: 'Ajouté aux favoris', data: favori });
  } catch (error) { next(error); }
}

export async function retirerFavori(req, res, next) {
  try {
    await prisma.favori.deleteMany({
      where: { userId: req.user.id, annonceId: req.params.annonceId }
    });
    res.json({ success: true, message: 'Retiré des favoris' });
  } catch (error) { next(error); }
}

export async function listeFavoris(req, res, next) {
  try {
    const favoris = await prisma.favori.findMany({
      where: { userId: req.user.id },
      include: { annonce: { include: { bien: { include: { photos: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: favoris });
  } catch (error) { next(error); }
}
