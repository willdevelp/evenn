# Evenn

Plateforme d'événements : billetterie, mini-sites, cagnottes, votes et RSVP.

## Authentification

L'authentification est gérée par [Better Auth](https://better-auth.com) avec un
adaptateur PostgreSQL (`pg`) et un mappage explicite des colonnes vers le schéma
SQL existant (voir `lib/auth.ts`).

### Méthodes activées

| Méthode | Configuration |
|---|---|
| Email / mot de passe | `emailAndPassword` |
| Google OAuth | `socialProviders.google` |
| Téléphone (OTP 6 chiffres) | plugin `phoneNumber` |
| Rôles / bannissement / impersonation | plugin `admin` |

### Tables utilisées

`user`, `session`, `account`, `verification`.

Le schéma n'utilise pas la convention snake_case de Better Auth : chaque champ est
mappé explicitement :

```
user          : emailVerified, createdAt, updatedAt, countryCode, locale,
                lastLoginAt, deletedAt, phoneNumber (plugin), role/banned (plugin admin)
session       : expiresAt, createdAt, updatedAt, ipAddress, userAgent, userId, impersonatedBy
account       : accountId, providerId, userId, accessToken, refreshToken, idToken,
                accessTokenExpiresAt*, refreshTokenExpiresAt*, scope, createdAt, updatedAt
verification  : expiresAt, createdAt, updatedAt
```

\* `timestamptz` côté SQL : Better Auth reçoit/renvoie des `Date`.

### Variables d'environnement

```
DATABASE_URL=postgres://...
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<32+ caractères>
TICKET_SECRET=<32+ caractères>   # signature HMAC des QR codes de billets
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Routes

| Route | Rôle |
|---|---|
| `POST/GET /api/auth/[...all]` | Endpoints Better Auth |
| `/auth/login` | Connexion (email/mot de passe + Google) |
| `/auth/register` | Inscription (email/mot de passe + Google, téléphone optionnel) |
| `/auth/verify-phone` | Vérification du numéro par code OTP |

Le dossier `/dashboard` est protégé par `app/dashboard/layout.tsx`
(`requireUser` dans `lib/session.ts`).

### Envoi des OTP / emails

`sendOTP` dans `lib/auth.ts` est un point d'extension : branchez-y votre
fournisseur SMS/WhatsApp. En développement, le code est affiché dans la console
du serveur.

## Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de production
npm run lint    # ESLint
```
