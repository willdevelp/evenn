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
                lastLoginAt, deleted_at, phoneNumber (plugin), role/banned (plugin admin)
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

Sur Netlify, configurez les identifiants privés dans les variables
d'environnement du projet. Les fichiers `.env*` sont ignorés par Git.
`BETTER_AUTH_SECRET` et les clés API doivent rester côté serveur ; ne les
préfixez jamais par `NEXT_PUBLIC_`.

L'analyse des secrets reste activée dans `netlify.toml`, y compris pour les
fonctions générées. Seules les variables publiques explicitement listées sont
exclues, notamment `BETTER_AUTH_URL`, qui est une URL publique sans identifiants.
La liste des variables dans la configuration résolue du journal Netlify ne
prouve pas qu'elles ont toutes été exposées. Pour diagnostiquer un échec,
consultez les détections qui précèdent le message final : elles indiquent la
variable et le fichier concernés, sans partager leurs valeurs. Si une clé
privée a été exposée, remplacez-la dans Netlify et retirez sa valeur du fichier
signalé ; n'ajoutez pas d'exclusion pour cette clé.

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

## Votes payants

Le module de vote public est disponible sur `/vote` et `/vote/[slug]`.

### Parcours de paiement

1. `createVoteOrder` crée une commande `orders` (`kind = 'vote'`, statut
   `pending`), une ligne `vote_purchases` et un paiement `pending`.
   Le nombre de votes et le montant sont **recalculés côté serveur** à partir du
   concours, du candidat et du pack : aucune valeur envoyée par le client n'est
   utilisée pour le prix.
2. Le prestataire envoie ensuite une notification signée sur
   `POST /api/webhooks/[provider]`.
3. `processWebhook` vérifie la signature, l'idempotence et le montant, puis
   `fulfillPaidOrder` insère les votes et les écritures comptables dans une
   seule transaction. Les triggers SQL mettent à jour `candidates.vote_count`.
4. La page `/vote/checkout?order=<uuid>` suit le statut et ne crédite jamais de
   votes avant la confirmation.

En développement, le fournisseur `mock` est actif et un bouton
« Simuler le paiement (dev) » signe une notification avec le même HMAC que le
webhook réel. Pour tester manuellement :

```bash
# Corps brut, signé avec MOCK_WEBHOOK_SECRET
curl -X POST http://localhost:3000/api/webhooks/mock \
  -H "Content-Type: application/json" \
  -H "x-signature: <hmac-sha256-hex>" \
  -d '{"id":"evt_1","type":"payment.succeeded","reference":"VOTE-...","status":"succeeded","amount":5000}'
```

### Variables d'environnement

```
MOCK_WEBHOOK_SECRET=<secret de signature du fournisseur mock>
VOTE_HASH_PEPPER=<poivre pour hacher les téléphones des votants>
ENABLE_MOCK_PROVIDER=true   # uniquement pour une démo hors développement
```

Le fournisseur `mock` est désactivé en production sauf si
`ENABLE_MOCK_PROVIDER=true`. Pour un vrai agrégateur (MTN MoMo, Orange Money,
CinetPay, Campay…), ajoutez une implémentation de `PaymentProvider` dans
`lib/payments/providers/` et exposez-la dans `providers/index.ts`.
