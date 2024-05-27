# Serveroo-Admin

## Description

Panel d'administration de notre application Serveroo

## Installation

Avant de lancer le projet, assurez-vous d'avoir installé les dépendances nécessaires en exécutant la commande suivante:

```bash
npm install
```

Rajouter aussi les fichiers d'environnement nécessaires :
- src/environments/env.dev.exclude.ts

```typescript
export const envDevExclude = {
  mail: '',
  password: '',
  stripe_api_key: '',
}
```

- src/environments/env.prod.exclude.ts

```typescript
export const envProdExclude = {
  stripe_api_key: '',
}
```

## Lancement

Pour lancer le projet, exécutez la commande suivante :

```bash
ionic serve
```
