//const User = require('../models/userModel');

exports.registerUser = async (req, res, next) => {
//    const user = new User({
//         ...req.body,
//         firebaseId: req.user.firebaseId
//     })
    try {
        { DATABASE_LOGIC }
        // await user.save()
        res.status(201).json({
            error: null,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            error: "INTERNAL_ERROR",
            data: {}
        });
    }
}

exports.login = async (req, res, next) => {

}