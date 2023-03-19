const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')


const signOptions = {
    issuer: "Air Connect Engieering(Thailand) Co.,Ltd.",
    audience: "Employee",
    algorithm: "RS256"
}

const publicKey = fs.readFileSync(path.resolve(__dirname, "../../key/public.key"))
const privateKey = fs.readFileSync(path.resolve(__dirname, "../../key/private.key"))

const generateToken = (payload) => jwt.sign(payload, privateKey, { ...signOptions })

const verifyToken = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, (err, decode) => {
        if (err) {
            console.log('error in verifyToken')
            reject('error')
        };
        if (decode.sub) {
            // return userId
            resolve(decode.sub)
        }
    })
})



module.exports = {
    generateToken,
    verifyToken
}