const mongoose = require("mongoose")

async function connectionMongoDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://pierre:SfknyA1Wo9Vpk52f@cluster0.gwtgw.mongodb.net/?retryWrites=true&w=majority")
        console.log("Connecté à mongodb")
    } catch (e) {
        console.log("Problème de connexion")
    }
}

module.exports = connectionMongoDB