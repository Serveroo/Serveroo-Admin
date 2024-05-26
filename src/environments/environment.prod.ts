import {envProdExclude} from "./env.prod.exclude";

export const environment = {
  production: true,
  base: 'https://serveroo.fr',
  mail: '',
  password: '',
  stripe_api_key: envProdExclude.stripe_api_key,
  stripe_subscription_enabled: false,
};
