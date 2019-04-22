import {createHmac} from 'crypto';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {EventType} from '../../../shared/enums/event-type.enum';
import {FirestoreCollections} from '../../../shared/enums/firestore-collections.enum';
import {GitProvider} from '../../../shared/enums/git-provider.enum';
import {today} from '../../../shared/utils/today';
import {ENV_CONFIG} from '../consts/env-config.const';

function bufferEq(a: Buffer, b: Buffer) {
  if (a.length !== b.length) {
    return false;
  }

  let c = 0;

  for (let i = 0; i < a.length; i++) {
    c |= a[i] ^ b[i]; // XOR
  }

  return c === 0;
}

function verifySignature(data: string, signature: string) {
  return bufferEq(
    new Buffer(signature),
    new Buffer(
      'sha1=' +
        createHmac('sha1', ENV_CONFIG.webhook.secret)
          .update(data)
          .digest('hex')
    )
  );
}

export const github = functions.https.onRequest(async (req, res) => {
  const sign = (req.headers['x-hub-signature'] || '') as string;
  const type = (req.headers['x-github-event'] || '') as EventType;

  if (!verifySignature(JSON.stringify(req.body), sign)) {
    console.error('error verifying signature');
    res.status(404).send({error: 'signature invalid'});
  }

  console.log('event', type);
  console.log('body', req.body);

  const toStore: any = {
    date: today(),
    type,
    provider: GitProvider.Github
  };

  switch (type) {
    case EventType.Push:
      toStore.commit = req.body.head_commit;
      toStore.repository = req.body.repository;

      await admin
        .firestore()
        .doc(`${FirestoreCollections.Events}/${toStore.commit.id}`)
        .set(toStore);
      break;
  }

  return res.json({});
});
