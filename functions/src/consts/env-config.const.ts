import * as functions from 'firebase-functions';

export const ENV_CONFIG = functions.config() as {
  webhook: {
    secret: string;
  };
};
