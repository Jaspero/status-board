import {createHmac} from 'crypto';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {EventType} from '../../../shared/enums/event-type.enum';
import {FirestoreCollections} from '../../../shared/enums/firestore-collections.enum';
import {ENV_CONFIG} from '../consts/env-config.const';

function verifySignature(data: string, signature: string) {
  return Buffer.compare(
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
  const type = req.headers['x-github-event'] as EventType;

  if (!verifySignature(JSON.stringify(req.body), sign)) {
    console.error('error verifying signature');
    res.status(404).send({error: 'signature invalid'});
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;

  console.log('event', type);
  console.log(JSON.parse(req.body));

  const toStore: any = {
    date,
    type
  };

  switch (type) {
    case EventType.Push:
      toStore.commit = req.body.head_commit;
      toStore.repository = req.body.repository;
      break;
  }

  await admin
    .firestore()
    .doc(`${FirestoreCollections.Events}/${today.getTime()}`)
    .set(toStore);

  res.json({});
});
