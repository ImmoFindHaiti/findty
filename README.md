# ImmoFind Haiti

Application de location et d'achat immobilier. Stack: React + Express + Prisma + PostgreSQL.

## Déploiement

### 1. GitHub

```bash
cd /home/oem/Music/immofind
git init
git add .
git commit -m "Initial commit"
# Créer un repo sur https://github.com, puis :
git remote add origin https://github.com/TON_COMPTE/immofind.git
git push -u origin main
```

### 2. Backend → Railway

- Projet → "Deploy from GitHub repo" → sélectionne `immofind`
- Root directory = `server/`
- Railway ajoute PostgreSQL automatiquement → DATABASE_URL injectée
- Variables d'env : `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `CLOUDINARY_*`
- URL générée ex: `https://immofind-prod.up.railway.app`

### 3. Frontend → Vercel

- "Add New Project" → GitHub → `immofind`
- Root directory = `client/`
- Env variable : `VITE_API_URL` = URL Railway + `/api`
- Build command: `npm run build` (auto)

### 4. Seed

```bash
npm i -g @railway/cli
railway login && railway link
railway run node prisma/seed.js
```

### Comptes démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@immofind.com | 123456 |
| Propriétaire | proprio@immofind.com | 123456 |
| Utilisateur | user@immofind.com | 123456 |

## Développement local

```bash
# Option 1 : script automatique
bash dev.sh

# Option 2 : manuel
cd server
cp .env.example .env  # changer DATABASE_URL en "file:./dev.db"
npx prisma db push
node prisma/seed.js
nodemon src/index.js
# Dans un autre terminal :
cd client && npm run dev
```
