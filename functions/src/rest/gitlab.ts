import * as functions from 'firebase-functions';

export const gitlab = functions.https.onRequest((req, res) => {
  res.send('Gitlab Webhook');
});
