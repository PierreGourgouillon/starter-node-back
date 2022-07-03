const firebase = require("../firebase/admin");
const firebaseDto = require("../dto/FirebaseDTO");

async function authMiddleware(request, response, next) {
    const headerToken = request.headers.authorization;
    if (!headerToken) {
        return response.send({
            error: "NO_TOKEN_PROVIDED",
            data: null
        }).status(401);
    }

    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
        response.send({
            error: "INVALID_TOKEN",
            data: null
        }).status(401);
    }
    const token = headerToken.split(" ")[1];
    try {
        const decodedToken = await firebase.auth().verifyIdToken(token, true);
        const firebaseUser = await firebase.auth().getUser(decodedToken.uid);

        let usr = new firebaseDto()
        usr.firebaseId = firebaseUser.uid
        usr.mail = firebaseUser.email

        request.user = usr
        next();
    } catch (error) {
        return response.send({
            error: "INVALID_TOKEN",
            data: null
        }).status(401);
    }
}

module.exports = authMiddleware;