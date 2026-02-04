# Backend (NestJS + Prisma)

## Lancer les conteneurs

À la **racine du projet** (là où se trouve `docker-compose.yml`) :

```bash
# Démarrer tous les services (backend, frontend, postgres)
docker compose up -d

# Ou en mode watch (hot reload)
docker compose watch
```

- **Backend** : http://localhost:3000  
- **Frontend** : http://localhost:4200  
- **Postgres** : localhost:5432  

---

## Commandes Prisma en local vers le conteneur

Les conteneurs doivent être démarrés (`docker compose up -d`). Depuis ta machine, tu te connectes à la base Postgres **dans le conteneur** via le port mappé `5432`.

Le fichier `.env` à la racine du projet doit contenir une URL pointant vers `localhost:5432` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/projet_db?schema=public"
```

Puis, dans le dossier **backend** :

```bash
cd backend

# Créer une migration après modification de prisma/schema.prisma
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations (sans en créer, utile en CI/prod)
npx prisma migrate deploy

# Régénérer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface web sur la base)
npx prisma studio --url database_url
```

Les migrations sont créées dans `backend/prisma/migrations/` et s’appliquent à la base Postgres du conteneur.
