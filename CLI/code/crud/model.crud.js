export function getDataModelCode() {
    return `
    const mongoose = require('mongoose')

const {MODEL_NAME}Schema = mongoose.Schema({
})

module.exports = mongoose.model("{MODEL_NAME_PROJECT}", {MODEL_NAME}Schema);
    `
}

export function getUserModelCode() {
    return `
    const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: { type: String, unique: true },
    firstname: String,
    lastname: String,
    {PASSWORD}
    userId: { type: String, unique: true }
})

module.exports = mongoose.model("User", UserSchema);
    `
}