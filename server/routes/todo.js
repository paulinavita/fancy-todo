const router = require('express').Router()
const {TodoController} = require('../controllers')
const {authentication} = require('../middleware/jwt')

router.get('/?', authentication, TodoController.findAll)
router.get('/unchecked', authentication, TodoController.findUnchecked)
router.get('/checked', authentication, TodoController.findChecked)
router.get('/:id',authentication, TodoController.findOne)
router.post('/',authentication , TodoController.create)
router.delete('/:id', authentication , TodoController.delete)
router.put('/:id', authentication, TodoController.update)

module.exports = router