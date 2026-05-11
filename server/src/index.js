import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes.js';
import bienRoutes from './routes/bien.routes.js';
import annonceRoutes from './routes/annonce.routes.js';
import photoRoutes from './routes/photo.routes.js';
import messageRoutes from './routes/message.routes.js';
import favoriRoutes from './routes/favori.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

export const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 2000 });
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/biens', bienRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favoris', favoriRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/seed', async (req, res) => {
  try {
    const bcrypt = (await import('bcryptjs')).default;
    const mdp = await bcrypt.hash('123456', 12);
    const admin = await prisma.user.upsert({ where: { email: 'admin@immofind.com' }, update: {}, create: { nom: 'Admin', prenom: 'Super', email: 'admin@immofind.com', motDePasse: mdp, telephone: '+50900000000', role: 'ADMIN', notificationsEnabled: true } });
    const proprio = await prisma.user.upsert({ where: { email: 'proprio@immofind.com' }, update: {}, create: { nom: 'Dupont', prenom: 'Jean', email: 'proprio@immofind.com', motDePasse: mdp, telephone: '+50911111111', role: 'PROPRIETAIRE', premium: true, premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), notificationsEnabled: true } });
    const user = await prisma.user.upsert({ where: { email: 'user@immofind.com' }, update: {}, create: { nom: 'Martin', prenom: 'Marie', email: 'user@immofind.com', motDePasse: mdp, telephone: '+50922222222', role: 'UTILISATEUR' } });
    const b1 = await prisma.bien.create({ data: { titre: 'Villa moderne à Pétion-Ville', description: 'Superbe villa avec piscine et jardin tropical.', type: 'VENTE', prix: 250000, surface: 200, chambres: 3, sallesBain: 2, localisation: 'Pétion-Ville, Rue principal', ville: 'Pétion-Ville', quartier: 'Bourdon', latitude: 18.5094, longitude: -72.2856 } });
    const b2 = await prisma.bien.create({ data: { titre: 'Appartement centre-ville', description: 'Bel appartement lumineux au cœur de Port-au-Prince.', type: 'LOCATION', prix: 15000, surface: 65, chambres: 2, sallesBain: 1, localisation: 'Port-au-Prince, Avenue John Brown', ville: 'Port-au-Prince', quartier: 'Bois-Verna', latitude: 18.5334, longitude: -72.3379 } });
    const b3 = await prisma.bien.create({ data: { titre: 'Maison de campagne à Kenscoff', description: 'Maison traditionnelle avec grand terrain.', type: 'VENTE', prix: 180000, surface: 150, chambres: 4, sallesBain: 2, localisation: 'Kenscoff, Route de Kenscoff', ville: 'Kenscoff', quartier: 'Furcy', latitude: 18.4472, longitude: -72.2857 } });
    const b4 = await prisma.bien.create({ data: { titre: 'Studio meublé Delmas', description: 'Studio meublé, idéal pour étudiant.', type: 'LOCATION', prix: 8000, surface: 30, chambres: 1, sallesBain: 1, localisation: 'Delmas, Rue Delmas', ville: 'Delmas', quartier: 'Delmas 31', latitude: 18.5445, longitude: -72.3103 } });
    const b5 = await prisma.bien.create({ data: { titre: 'Penthouse de luxe', description: 'Penthouse avec terrasse panoramique, vue imprenable sur la mer.', type: 'VENTE', prix: 450000, surface: 300, chambres: 5, sallesBain: 3, localisation: 'Pétion-Ville, Morne Calvaire', ville: 'Pétion-Ville', quartier: 'Morne Calvaire', latitude: 18.5050, longitude: -72.2800 } });
    await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: b1.id } });
    await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: b2.id } });
    await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: b3.id } });
    await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: b4.id } });
    await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: b5.id } });
    res.json({ success: true, message: 'Base de données initialisée avec succès !', users: { admin: admin.email, proprio: proprio.email, user: user.email } });
  } catch (e) {
    if (e.code === 'P2002') return res.json({ success: true, message: 'Déjà seedé' });
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ImmoFind API OK' });
});

const CLIENT_DIST = path.join(__dirname, '../../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.use(errorMiddleware);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ImmoFind lancé sur http://0.0.0.0:${PORT}`);
});
