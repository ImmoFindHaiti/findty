import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

async function seedDefaults() {
  try {
    const mdp = await bcrypt.hash('123456', 12);
    await prisma.user.upsert({ where: { email: 'admin@immofind.com' }, update: {}, create: { nom: 'Admin', prenom: 'Super', email: 'admin@immofind.com', motDePasse: mdp, telephone: '+50900000000', role: 'ADMIN', notificationsEnabled: true } });
    await prisma.user.upsert({ where: { email: 'proprio@immofind.com' }, update: {}, create: { nom: 'Dupont', prenom: 'Jean', email: 'proprio@immofind.com', motDePasse: mdp, telephone: '+50911111111', role: 'PROPRIETAIRE', premium: true, premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), notificationsEnabled: true } });
    await prisma.user.upsert({ where: { email: 'user@immofind.com' }, update: {}, create: { nom: 'Martin', prenom: 'Marie', email: 'user@immofind.com', motDePasse: mdp, telephone: '+50922222222', role: 'UTILISATEUR' } });
    console.log('Comptes par défaut créés');
  } catch (e) { console.log('Comptes déjà existants'); }
}
seedDefaults();

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

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Findty API OK' });
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
  console.log(`Findty lancé sur http://0.0.0.0:${PORT}`);
});
