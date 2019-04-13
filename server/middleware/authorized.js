const jwt = require('jsonwebtoken');
const { authentication } = require('../middleware/jwt')
const Todo = require('../models/todo')

module.exports = {
    authorizedUser: function (req, res, next) {
        console.log('masuk sini')
        Todo.findOne({_id : req.params.id})
        .populate('userId')
        .then(foundTodo =>{
            if (foundTodo.userId._id == req.authenticatedUser.id) next ()
            else res.status(401).json({message : 'You are unauthorized'})
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }
}