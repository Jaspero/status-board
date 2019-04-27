import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FirestoreCollections} from '../../../shared/enums/firestore-collections.enum';

export const userCreated = functions.auth.user().onCreate(async user => {
  const documentRef = await firestore()
    .doc('settings/general')
    .get();
  const members = (documentRef.data() || {}).members || [];
  const member = members.find((mem: any) => mem.email === user.email);

  if (member) {
    const customClaims = {
      role: member.role
    };

    await Promise.all([
      auth().setCustomUserClaims(user.uid, customClaims),
      firestore()
        .doc(`${FirestoreCollections.Members}/${user.email}`)
        .set({
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL
        })
    ]);
  }

  return true;
});
