import { prisma } from '../index.js';

export async function setNotifications(req, res, next) {
  try {
    const { enabled } = req.body;
    await prisma.user.update({ where: { id: req.user.id }, data: { notificationsEnabled: enabled } });
    res.json({ success: true, message: enabled ? 'Notifications activées' : 'Notifications désactivées' });
  } catch (error) { next(error); }
}

export async function getNonLus(req, res, next) {
  try {
    const count = await prisma.message.count({ where: { destinataireId: req.user.id, lu: false } });
    res.json({ success: true, data: { count } });
  } catch (error) { next(error); }
}

export async function dashboardStats(req, res, next) {
  try {
    const annonces = await prisma.annonce.count({ where: { proprietaireId: req.user.id } });
    const annoncesActives = await prisma.annonce.count({ where: { proprietaireId: req.user.id, statut: 'ACTIVE', isLocked: false } });
    const messagesNonLus = await prisma.message.count({ where: { destinataireId: req.user.id, lu: false } });
    const totalVues = await prisma.annonce.aggregate({ where: { proprietaireId: req.user.id }, _sum: { vues: true } });
    const messagesRecus = await prisma.message.count({ where: { destinataireId: req.user.id } });

    res.json({ success: true, data: { annonces, annoncesActives, messagesNonLus, messagesRecus, totalVues: totalVues._sum.vues || 0 } });
  } catch (error) { next(error); }
}
