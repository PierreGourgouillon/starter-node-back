export function getUserDTOCode() {
    return `
    class UserDTO {
      userId
    }
    
    module.exports = UserDTO;    
    `
}

export function getJWTMiddlewareCode() {
  return `
  const jwt = require("jsonwebtoken")
require("dotenv").config()

function jwtAuthentication(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }

            req.user = user
            next()
        })
    }
    return res.sendStatus(401)
}
  `
}