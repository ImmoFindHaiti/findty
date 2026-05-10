import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function register(req, res, next) {
  try {
    const { nom, prenom, email, motDePasse, telephone, role } = req.body;
    const existant = await prisma.user.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
    }
    const motDePasseHash = await bcrypt.hash(motDePasse, 12);
    const userRole = role === 'PROPRIETAIRE' ? 'PROPRIETAIRE' : 'UTILISATEUR';
    const premium = userRole === 'PROPRIETAIRE';
    const premiumExpiresAt = userRole === 'PROPRIETAIRE' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasse: motDePasseHash, telephone, role: userRole, premium, premiumExpiresAt }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({
      success: true,
      message: userRole === 'PROPRIETAIRE' ? 'Inscription réussie ! 1 mois offert.' : 'Inscription réussie',
      data: { user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, avatar: user.avatar, premium: user.premium }, token }
    });
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, motDePasse } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({
      success: true, message: 'Connexion réussie',
      data: { user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, avatar: user.avatar, telephone: user.telephone, premium: user.premium, notificationsEnabled: user.notificationsEnabled }, token }
    });
  } catch (error) { next(error); }
}

export async function logout(req, res) {
  res.json({ success: true, message: 'Déconnexion réussie' });
}

export async function me(req, res) {
  res.json({ success: true, data: req.user });
}

export async function updateProfil(req, res, next) {
  try {
    const { nom, prenom, telephone, notificationsEnabled } = req.body;
    let avatar = undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'immofind/avatars' });
      avatar = result.secure_url;
    }
    const data = {};
    if (nom) data.nom = nom;
    if (prenom) data.prenom = prenom;
    if (telephone !== undefined) data.telephone = telephone;
    if (notificationsEnabled !== undefined) data.notificationsEnabled = notificationsEnabled;
    if (avatar) data.avatar = avatar;

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ success: true, message: 'Profil mis à jour', data: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, avatar: user.avatar, telephone: user.telephone, premium: user.premium, notificationsEnabled: user.notificationsEnabled } });
  } catch (error) { next(error); }
}
