import { prisma } from '../index.js';

export async function listBiens(req, res, next) {
  try {
    const { type, budgetMax, ville, surface, chambres, page = 1, limit = 12 } = req.query;
    const where = { disponible: true, annonce: { isLocked: false } };
    if (type) where.type = type;
    if (ville) where.ville = { contains: ville };
    if (surface) where.surface = { gte: parseFloat(surface) };
    if (chambres) where.chambres = { gte: parseInt(chambres) };
    if (budgetMax) where.prix = { lte: parseFloat(budgetMax) };

    const total = await prisma.bien.count({ where });
    const biens = await prisma.bien.findMany({
      where,
      include: { photos: { take: 1 }, annonce: { select: { id: true, isLocked: true } } },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: biens,
      meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) { next(error); }
}

export async function getBien(req, res, next) {
  try {
    const bien = await prisma.bien.findUnique({
      where: { id: req.params.id },
      include: { photos: true, annonce: { include: { proprietaire: { select: { id: true, nom: true, prenom: true, email: true, telephone: true } } } } }
    });
    if (!bien) {
      return res.status(404).json({ success: false, message: 'Bien introuvable' });
    }
    if (bien.annonce) {
      await prisma.annonce.update({ where: { id: bien.annonce.id }, data: { vues: { increment: 1 } } });
    }
    res.json({ success: true, data: bien });
  } catch (error) { next(error); }
}
