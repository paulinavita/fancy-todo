const jwt = require('jsonwebtoken');

module.exports = {
    authorizedUser: function (req, res, next) {
        if (req.authenticatedUser.id == req.params.id) {
            next()
        } else {
            res.status(401).json({
                message: 'You are unauthorized'
            })
        }
    }
}