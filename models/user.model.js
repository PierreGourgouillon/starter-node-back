const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firebaseId: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true }
})

module.exports = mongoose.model("User", userSchema);