const jwt = require('jsonwebtoken')

module.exports = {
    authentication : function(req, res, next) {
        try {
            const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
            req.authenticatedUser= decoded
            // console.log('isi authenticated user', req.authenticatedUser)
            next()
        } catch {
            res.status(401).json({
                message : 'You are not logged in'
            })
        }
    }
}