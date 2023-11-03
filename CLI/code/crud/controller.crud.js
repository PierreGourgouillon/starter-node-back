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

export function getLogControllerCode() {
    return `
    const User = require('../models/user.model.js');
    {CRYPTO_VARIABLE}

exports.register = async (req, res, next) => {
    try {
        const { email, firstname, lastname, password } = req.body;

        const existingUser = await User.findOne({ email: req.body.email })
        
        if (existingUser) {
            return res.status(400).json({ message: 'USER_ALREADY_EXIST' });
        }

        if (password.length <= 6) {
            return res.status(400).json({ message: 'PASSWORD_INCORRECT' });
        }

        const newUser = new User({
            ...req.body,
            userId: {GET_USERID_CODE}
        })
        await newUser.save()

        res.status(201).json({
            error: null,
            data: {
                email: email,
                firstname: firstname,
                lastname: lastname
            }
        });
    } catch (error) {
        res.status(400).json({
            error: "INTERNAL_ERROR",
            data: {}
        });
    }
};

exports.login = async (req, res, next) => {};
    `
}

export function getRequireLogAppCode() {
    return `const authRoutes = require('./routes/auth.routes.js')`
}

export function getAppLogUseCode() {
    return `app.use('/api/auth', authRoutes);`
}