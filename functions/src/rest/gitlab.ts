import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {EventType} from '../../../shared/enums/event-type.enum';
import {FirestoreCollections} from '../../../shared/enums/firestore-collections.enum';
import {GitProvider} from '../../../shared/enums/git-provider.enum';
import {today} from '../../../shared/utils/today';
import {ENV_CONFIG} from '../consts/env-config.const';

const EVENT_MAP = {
  'Push Hook': EventType.Push
};

export const gitlab = functions.https.onRequest(async (req, res) => {
  const type = req.headers['x-gitlab-event'];

  console.log('body', req.body);
  console.log('headers', req.headers);

  if (ENV_CONFIG.webhook.secret !== req.headers['x-gitlab-token']) {
    return res.status(404).send({error: 'signature invalid'});
  }

  const toStore: any = {
    date: today(),
    type,
    provider: GitProvider.Gitlab
  };

  switch (req.headers['x-gitlab-event']) {
    case EVENT_MAP['Push Hook']:
      toStore.commit = req.body.commits[0];
      toStore.commit.author.username = req.body.user_username;
      toStore.repository = req.body.repository;
      break;
  }

  await admin
    .firestore()
    .doc(`${FirestoreCollections.Events}/${Date.now()}`)
    .set(toStore);

  return res.json({});
});
