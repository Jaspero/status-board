import {createHmac} from 'crypto';
import * as functions from 'firebase-functions';
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

export const github = functions.https.onRequest((req, res) => {
  const sign = (req.headers['x-hub-signature'] || '') as string;
  const event = req.headers['x-github-event'] as string;

  if (!verifySignature(JSON.stringify(req.body), sign)) {
    console.error('error verifying signature');
    res.status(404).send({error: 'signature invalid'});
  }

  console.log('event', event);
  console.log(JSON.parse(req.body));

  // switch (event) {
  //   case 'push':
  //     break;
  // }

  res.json({});
});
