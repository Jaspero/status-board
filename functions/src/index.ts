import * as functions from 'firebase-functions';

export const github = functions.https.onRequest((req, res) => {
  res.send('Github Webhook');
});

export const gitlab = functions.https.onRequest((req, res) => {
  res.send('Gitlab Webhook');
});
