const router = require('express').Router()
const {TodoController} = require('../controllers')
const {authentication} = require('../middleware/jwt')
const {authorizedUser} = require('../middleware/authorized')

router.get('/?', authentication, TodoController.findAll)
router.get('/:id/unchecked', authentication, TodoController.findUnchecked)
router.get('/:id/checked', authentication, TodoController.findChecked)
router.get('/:id', authentication, TodoController.findOne)
router.post('/',authentication, TodoController.create)
router.delete('/:id', authentication, authorizedUser, TodoController.delete)
router.patch('/:id', authentication, authorizedUser, TodoController.update)

module.exports = router 