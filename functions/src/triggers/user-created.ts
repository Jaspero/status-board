import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';

export const userCreated = functions.auth.user().onCreate(async user => {
  const documentRef = await firestore()
    .doc('settings/members')
    .get();
  const members = (documentRef.data() || {}).members || [];
  const member = members.find((mem: any) => mem.email === user.email);

  if (member) {
    const customClaims = {
      role: member.role
    };

    // Set custom user claims on this newly created user.
    await auth().setCustomUserClaims(user.uid, customClaims);
  }

  return true;
});