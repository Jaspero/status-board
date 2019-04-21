import {initializeApp} from 'firebase-admin';

initializeApp();

// Triggers
export {userCreated} from './triggers/user-created';

// Rest
export {github} from './rest/github';
export {gitlab} from './rest/gitlab';
