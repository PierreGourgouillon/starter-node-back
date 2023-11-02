export function getControllerCode() {
    return `
    const {ROUTE_NAME_CODE} = require('../models/{ROUTE_NAME}.model.js');

    exports.{GET_CONTROLLER_NAME} = async (req, res, next) => {
    }

    exports.{POST_CONTROLLER_NAME} = async (req, res, next) => {
    }

    exports.{PUT_CONTROLLER_NAME} = async (req, res, next) => {
    }

    exports.{DELETE_CONTROLLER_NAME} = async (req, res, next) => {
    }
    `
}

export function getRequireAppCode() {
    return `const {ROUTE_NAME}Routes = require('./routes/{ROUTE_NAME}.routes.js')`
}

export function getAppUseCode() {
    return `app.use('/api/{ROUTE_NAME}s', {ROUTE_NAME}Routes);`
}