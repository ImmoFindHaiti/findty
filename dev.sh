#!/bin/bash
# ImmoFind — Démarrage en local (SQLite)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== ImmoFind Haiti – Mode développement local ==="

# 1. Sauvegarder et passer le schéma Prisma en SQLite
cd server
if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
  sed -i 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
  WAS_POSTGRES=true
else
  WAS_POSTGRES=false
fi

# Restaurer PostgreSQL à la sortie
restore_schema() {
  if [ "$WAS_POSTGRES" = true ]; then
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
    echo "✓ Schéma restauré → PostgreSQL"
  fi
}
trap restore_schema EXIT

# 2. Configurer .env local
if ! grep -q "file:./dev.db" .env 2>/dev/null; then
  cat > .env << 'ENVEOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-local-123456"
JWT_EXPIRES_IN="7d"
PORT=8080
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-api-secret"
ENVEOF
  echo "✓ .env local créé"
fi

# 3. Installer les dépendances si besoin
if [ ! -d "node_modules" ]; then
  npm install
  echo "✓ Dépendances serveur installées"
fi

# 4. Créer la base SQLite + générer le client Prisma
npx prisma db push 2>/dev/null
echo "✓ Base SQLite prête"

# 5. Seed si la base est vide
COUNT=$(node -e "import{PrismaClient}from'@prisma/client';const p=new PrismaClient();p.user.count().then(c=>{console.log(c);p.\$disconnect()})" 2>/dev/null || echo "0")
if [ "$COUNT" = "0" ]; then
  node prisma/seed.js
  echo "✓ Données de test insérées"
fi

# 6. Build le frontend
cd ../client
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build 2>/dev/null && echo "✓ Frontend rebuild" || echo "⚠ Build frontend ignoré"

# 7. Lancer le serveur
cd ../server
echo ""
echo "=== ImmoFind lancé sur http://localhost:8080 ==="
echo "   Admin: admin@immofind.com / 123456"
echo "   Proprio: proprio@immofind.com / 123456"
echo "   User: user@immofind.com / 123456"
echo ""
npx nodemon src/index.js
