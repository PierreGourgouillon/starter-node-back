const mongoose = require("mongoose")
require('dotenv').config();

async function connectionMongoDB() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("Connecté à mongodb")
    } catch (e) {
        console.log("Problème de connexion")
    }
}

module.exports = connectionMongoDB