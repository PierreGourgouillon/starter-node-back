export function mongodbConnection() {
    return `
    const mongoose = require("mongoose")
    require('dotenv').config();

    async function connectionMongoDB() {
        try {
            mongoose.set("strictQuery", true)
            await mongoose.connect(process.env.MONGOOSE_URL)
            console.log("Connecté à mongodb")
        } catch (e) {
            console.log("Problème de connexion")
        }
    }

    module.exports = connectionMongoDB`
}

export function mongodbRequire() {
    return `connectionMongoDB = require('./database/mongodb.init.js'),`
}