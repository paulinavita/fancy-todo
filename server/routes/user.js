const router = require('express').Router()
const {UserController} = require('../controllers')
const {authorized} = require('../middleware/authorized')
const {authentication} = require('../middleware/jwt')


router.get('/', authentication, UserController.findAll)
router.get('/:username', authentication, UserController.findOne)
router.post('/', UserController.register)



module.exports = router