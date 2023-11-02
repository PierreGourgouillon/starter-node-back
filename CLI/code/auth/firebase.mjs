export function getFirebaseAuthCode() {
    return `
    const firebase = require("firebase-admin");
    const credentials = require("./credentials.json");

    firebase.initializeApp({
      credential: firebase.credential.cert(credentials),
    });

    module.exports = firebase;
    `
}

export function getFirebaseAuthMiddleWareCode() {
  return `
  const firebase = require('../firebase/firebase.init.js');
  const UserDto = require('../dto/user.dto.js');
  
  async function authMiddleware(request, response, next) {
    const headerToken = request.headers.authorization;
    if (!headerToken) {
      return response
        .send({
          error: 'NO_TOKEN_PROVIDED',
          data: null,
        })
        .status(401);
    }
  
    if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
      response
        .send({
          error: 'INVALID_TOKEN',
          data: null,
        })
        .status(401);
    }
    const token = headerToken.split(' ')[1];
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token, true);
      const firebaseUser = await firebase.auth().getUser(decodedToken.uid);
  
      let user = new UserDto();
      user.userId = firebaseUser.uid;
  
      request.user = user;
      next();
    } catch (error) {
      return response
        .send({
          error: 'INVALID_TOKEN',
          data: null,
        })
        .status(401);
    }
  }
  
  module.exports = authMiddleware;
  `
}