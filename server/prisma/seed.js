import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const mdp = await bcrypt.hash('123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@findty.com' },
    update: {},
    create: { nom: 'Admin', prenom: 'Super', email: 'admin@findty.com', motDePasse: mdp, telephone: '+50900000000', role: 'ADMIN', notificationsEnabled: true }
  });

  const proprio = await prisma.user.upsert({
    where: { email: 'proprio@findty.com' },
    update: {},
    create: { nom: 'Dupont', prenom: 'Jean', email: 'proprio@findty.com', motDePasse: mdp, telephone: '+50911111111', role: 'PROPRIETAIRE', premium: true, premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), notificationsEnabled: true }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@findty.com' },
    update: {},
    create: { nom: 'Martin', prenom: 'Marie', email: 'user@findty.com', motDePasse: mdp, telephone: '+50922222222', role: 'UTILISATEUR' }
  });

  const bien1 = await prisma.bien.create({
    data: { titre: 'Villa moderne à Pétion-Ville', description: 'Superbe villa avec piscine et jardin tropical. 3 chambres, 2 salles de bain, grand salon avec vue sur la baie.', type: 'VENTE', prix: 85000, surface: 200, chambres: 3, sallesBain: 2, localisation: 'Pétion-Ville, Rue principal', ville: 'Pétion-Ville', quartier: 'Bourdon', latitude: 18.5094, longitude: -72.2856 }
  });

  const bien2 = await prisma.bien.create({
    data: { titre: 'Appartement centre-ville', description: 'Bel appartement lumineux au cœur de Port-au-Prince. Idéal pour jeune professionnel.', type: 'LOCATION', prix: 500, surface: 65, chambres: 2, sallesBain: 1, localisation: 'Port-au-Prince, Avenue John Brown', ville: 'Port-au-Prince', quartier: 'Bois-Verna', latitude: 18.5334, longitude: -72.3379 }
  });

  const bien3 = await prisma.bien.create({
    data: { titre: 'Maison de campagne à Kenscoff', description: 'Maison traditionnelle avec grand terrain. Parfaite pour se ressourcer au vert.', type: 'VENTE', prix: 65000, surface: 150, chambres: 4, sallesBain: 2, localisation: 'Kenscoff, Route de Kenscoff', ville: 'Kenscoff', quartier: 'Furcy', latitude: 18.4472, longitude: -72.2857 }
  });

  const bien4 = await prisma.bien.create({
    data: { titre: 'Studio meublé Delmas', description: 'Studio meublé, idéal pour étudiant ou personne seule. Toutes commodités à proximité.', type: 'LOCATION', prix: 300, surface: 30, chambres: 1, sallesBain: 1, localisation: 'Delmas, Rue Delmas', ville: 'Delmas', quartier: 'Delmas 31', latitude: 18.5445, longitude: -72.3103 }
  });

  const bien5 = await prisma.bien.create({
    data: { titre: 'Penthouse de luxe', description: 'Penthouse avec terrasse panoramique, vue imprenable sur la mer. Prestations haut de gamme.', type: 'VENTE', prix: 150000, surface: 300, chambres: 5, sallesBain: 3, localisation: 'Pétion-Ville, Morne Calvaire', ville: 'Pétion-Ville', quartier: 'Morne Calvaire', latitude: 18.5050, longitude: -72.2800 }
  });

  await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: bien1.id } });
  await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: bien2.id } });
  await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: bien3.id } });
  await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: bien4.id } });
  await prisma.annonce.create({ data: { proprietaireId: proprio.id, bienId: bien5.id } });

  console.log('Données de seed créées avec succès !');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
