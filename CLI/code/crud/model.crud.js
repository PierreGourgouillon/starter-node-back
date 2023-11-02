export function getDataModelCode() {
    return `
    const mongoose = require('mongoose')

const {MODEL_NAME}Schema = mongoose.Schema({
})

module.exports = mongoose.model("{MODEL_NAME_PROJECT}", {MODEL_NAME}Schema);
    `
}