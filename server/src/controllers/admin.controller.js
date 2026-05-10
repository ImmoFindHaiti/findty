import { prisma } from '../index.js';

export async function listeUtilisateurs(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nom: true, prenom: true, email: true, telephone: true, role: true, avatar: true, premium: true, premiumExpiresAt: true, createdAt: true, _count: { select: { annonces: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) { next(error); }
}

export async function changerRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['UTILISATEUR', 'PROPRIETAIRE', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Rôle invalide' });
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, nom: true, prenom: true, email: true, role: true }
    });
    res.json({ success: true, message: 'Rôle mis à jour', data: user });
  } catch (error) { next(error); }
}

export async function toggleLockAnnonce(req, res, next) {
  try {
    const annonce = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    const updated = await prisma.annonce.update({
      where: { id: req.params.id },
      data: { isLocked: !annonce.isLocked },
      include: { bien: true }
    });
    res.json({ success: true, message: updated.isLocked ? 'Annonce verrouillée' : 'Annonce déverrouillée', data: updated });
  } catch (error) { next(error); }
}

export async function setPremium(req, res, next) {
  try {
    const { premium } = req.body;
    const expiresAt = premium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { premium, premiumExpiresAt: expiresAt },
      select: { id: true, nom: true, prenom: true, email: true, premium: true, premiumExpiresAt: true }
    });
    res.json({ success: true, message: premium ? 'Premium activé (30 jours)' : 'Premium désactivé', data: user });
  } catch (error) { next(error); }
}

export async function toutesAnnonces(req, res, next) {
  try {
    const annonces = await prisma.annonce.findMany({
      include: { bien: { include: { photos: { take: 1 } } }, proprietaire: { select: { id: true, nom: true, prenom: true, email: true, premium: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: annonces });
  } catch (error) { next(error); }
}

export async function supprimerUtilisateur(req, res, next) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    if (user.role === 'ADMIN') return res.status(400).json({ success: false, message: 'Impossible de supprimer un administrateur' });

    const annonces = await prisma.annonce.findMany({ where: { proprietaireId: id } });
    for (const annonce of annonces) {
      await prisma.photo.deleteMany({ where: { bienId: annonce.bienId } });
      await prisma.favori.deleteMany({ where: { annonceId: annonce.id } });
      await prisma.message.deleteMany({ where: { annonceId: annonce.id } });
      await prisma.annonce.delete({ where: { id: annonce.id } });
      await prisma.bien.delete({ where: { id: annonce.bienId } });
    }
    await prisma.favori.deleteMany({ where: { userId: id } });
    await prisma.message.deleteMany({ where: { OR: [{ expediteurId: id }, { destinataireId: id }] } });
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) { next(error); }
}

export async function supprimerAnnonceAdmin(req, res, next) {
  try {
    const annonce = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    await prisma.photo.deleteMany({ where: { bienId: annonce.bienId } });
    await prisma.message.deleteMany({ where: { annonceId: annonce.id } });
    await prisma.favori.deleteMany({ where: { annonceId: annonce.id } });
    await prisma.annonce.delete({ where: { id: annonce.id } });
    await prisma.bien.delete({ where: { id: annonce.bienId } });
    res.json({ success: true, message: 'Annonce supprimée par l\'administrateur' });
  } catch (error) { next(error); }
}
