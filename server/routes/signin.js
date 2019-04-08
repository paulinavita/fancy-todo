const router = require('express').Router()
const {UserController} = require('../controllers')

router.post('/local',  UserController.local)
router.post('/google', UserController.google)

module.exports = router