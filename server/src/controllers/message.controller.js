import { prisma } from '../index.js';

export async function envoyerMessage(req, res, next) {
  try {
    const { contenu, destinataireId, annonceId } = req.body;
    const annonce = await prisma.annonce.findUnique({ where: { id: annonceId } });
    if (!annonce) return res.status(404).json({ success: false, message: 'Annonce introuvable' });
    const message = await prisma.message.create({
      data: { contenu, expediteurId: req.user.id, destinataireId, annonceId }
    });
    res.status(201).json({ success: true, message: 'Message envoyé', data: message });
  } catch (error) { next(error); }
}

export async function getConversation(req, res, next) {
  try {
    const { annonceId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        annonceId,
        OR: [{ expediteurId: req.user.id }, { destinataireId: req.user.id }]
      },
      include: { expediteur: { select: { id: true, nom: true, prenom: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: messages });
  } catch (error) { next(error); }
}

export async function marquerLu(req, res, next) {
  try {
    await prisma.message.update({ where: { id: req.params.id }, data: { lu: true } });
    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) { next(error); }
}

export async function nonLus(req, res, next) {
  try {
    const count = await prisma.message.count({ where: { destinataireId: req.user.id, lu: false } });
    res.json({ success: true, data: { count } });
  } catch (error) { next(error); }
}

export async function listeConversations(req, res, next) {
  try {
    const messages = await prisma.message.findMany({
      where: { OR: [{ expediteurId: req.user.id }, { destinataireId: req.user.id }] },
      include: {
        expediteur: { select: { id: true, nom: true, prenom: true, avatar: true } },
        destinataire: { select: { id: true, nom: true, prenom: true, avatar: true } },
        annonce: { include: { bien: { select: { titre: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    const conversationsMap = new Map();
    for (const msg of messages) {
      const key = msg.annonceId;
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, { annonce: msg.annonce, dernierMessage: msg, expediteur: msg.expediteur, destinataire: msg.destinataire });
      }
    }
    res.json({ success: true, data: Array.from(conversationsMap.values()) });
  } catch (error) { next(error); }
}
