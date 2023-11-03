export function getRouterCode() {
    return `
    const express = require('express');
const router = express.Router();
const controller = require('../controllers/{ROUTE_NAME}.controller')
{IMPORT_MIDDLEWARE}

router.get({GET_METHOD_NAME_ALL}, {GET_CONTROLLER_ALL})
router.get({GET_METHOD_NAME}, {GET_CONTROLLER})
router.post({POST_METHOD_NAME}, {POST_CONTROLLER})
router.put({PUT_METHOD_NAME}, {PUT_CONTROLLER})
router.delete({DELETE_METHOD_NAME}, {DELETE_CONTROLLER})

module.exports = router;
    `
}

export function getLogRouterCode() {
    return `
    const express = require('express');
    const router = express.Router();
    const controller = require('../controllers/auth.controller')
    {MIDDLEWARE_VARIABLE}

    router.post("/register", {REGISTER_CONTROLLER})
    router.post("/login", {LOGIN_CONTROLLER})

    module.exports = router;
    `
}