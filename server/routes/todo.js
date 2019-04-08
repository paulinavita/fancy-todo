const router = require('express').Router()
const {TodoController} = require('../controllers')
const {authentication} = require('../middleware/jwt')
const {authorizedUser} = require('../middleware/authorized')

router.get('/?', authentication, TodoController.findAll)
router.get('/:id/unchecked', authentication, authorizedUser, TodoController.findUnchecked)
router.get('/:id/checked', authentication, authorizedUser, TodoController.findChecked)
router.get('/:id',authentication, authorizedUser, TodoController.findOne)
router.post('/:id',authentication,authorizedUser, TodoController.create)
router.delete('/:id', authentication, TodoController.delete)
router.put('/:id', authentication, TodoController.update)

module.exports = router