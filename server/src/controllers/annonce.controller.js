import { prisma } from '../index.js';

export async function creerAnnonce(req, res, next) {
  try {
    if (req.user.role === 'PROPRIETAIRE' && !req.user.premium) {
      return res.status(403).json({ success: false, message: 'Compte Premium requis pour publier. Contactez l\'administrateur.' });
    }
    const { titre, description, type, prix, surface, chambres, sallesBain, localisation, ville, quartier, latitude, longitude } = req.body;
    const bien = await prisma.bien.create({
      data: { titre, description, type, prix, surface: surface || null, chambres: chambres || null, sallesBain: sallesBain || null, localisation, ville, quartier: quartier || null, latitude: latitude || null, longitude: longitude || null }
    });
    const annonce = await prisma.annonce.create({
      data: { proprietaireId: req.user.id, bienId: bien.id, isLocked: false }
    });
    res.status(201).json({ success: true, message: 'Annonce créée avec succès', data: { ...annonce, bien } });
  } catch (error) { next(error); }
}

export async function modifierAnnonce(req, res, next) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id: req.params.id },
      include: { bien: true }
    });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    if (annonce.proprietaireId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    const { titre, description, type, prix, surface, chambres, sallesBain, localisation, ville, quartier, latitude, longitude } = req.body;
    const bien = await prisma.bien.update({
      where: { id: annonce.bienId },
      data: { titre, description, type, prix, surface, chambres, sallesBain, localisation, ville, quartier, latitude, longitude }
    });
    res.json({ success: true, message: 'Annonce modifiée avec succès', data: { ...annonce, bien } });
  } catch (error) { next(error); }
}

export async function supprimerAnnonce(req, res, next) {
  try {
    const annonce = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    if (annonce.proprietaireId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    await prisma.photo.deleteMany({ where: { bienId: annonce.bienId } });
    await prisma.message.deleteMany({ where: { annonceId: annonce.id } });
    await prisma.favori.deleteMany({ where: { annonceId: annonce.id } });
    await prisma.annonce.delete({ where: { id: annonce.id } });
    await prisma.bien.delete({ where: { id: annonce.bienId } });
    res.json({ success: true, message: 'Annonce supprimée avec succès' });
  } catch (error) { next(error); }
}

export async function mesAnnonces(req, res, next) {
  try {
    const annonces = await prisma.annonce.findMany({
      where: { proprietaireId: req.user.id },
      include: { bien: { include: { photos: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: annonces });
  } catch (error) { next(error); }
}

export async function changerStatut(req, res, next) {
  try {
    const { statut } = req.body;
    const annonce = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    if (annonce.proprietaireId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    const updated = await prisma.annonce.update({
      where: { id: req.params.id },
      data: { statut },
      include: { bien: true }
    });
    if (statut === 'VENDU' || statut === 'LOUE') {
      await prisma.bien.update({ where: { id: annonce.bienId }, data: { disponible: false } });
    } else {
      await prisma.bien.update({ where: { id: annonce.bienId }, data: { disponible: true } });
    }
    res.json({ success: true, message: 'Statut mis à jour', data: updated });
  } catch (error) { next(error); }
}
