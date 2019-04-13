const { Todo } = require('../models/')

class TodoController {

    static create(req, res) {
        let newTodo = new Todo({ ...req.body, userId: req.authenticatedUser.id, createdAt: new Date() })
        newTodo.save()
            // Todo.create({...req.body})
            .then(saved => {
                // console.log('berhasil save')
                res.status(201).json(saved)
            })
            .catch(err => {
                // console.log('gagal create todo')
                res.status(400).json(err)
            })

    }

    static update(req, res) {
        Todo.findOneAndUpdate({ _id: req.params.id },  { $set: req.body }, {new : true})
            .then(found => {
                if (found) {
                    console.log('ketemu data')
                    res.status(200).json(found)
                } else {
                    res.status(404).json({ message: `No such id exist` })
                }
            })
            .catch(err => {
                console.log('err di bag updadte')
                res.status(400).json(err)
            })
    }

    static delete(req, res) {
        Todo
            .findOneAndDelete({ _id: req.params.id })
            .then(found => {
                // console.log('deleting one todo')
                if (!found) {
                    res.status(404).json({ message: `No such id exist` })
                } else {
                    res.status(200).json(found)
                }
            })
            .catch(err => {
                // console.log('err bag delete')
                res.status(400).json(err)
            })
    }

    static findOne(req, res) {
        // console.log('masuk')
        Todo.findOne({ _id: req.params.id })
            .then(found => {
                if (found) res.status(200).json(found)
                else res.status(404).json({ message: `No such id exist` })
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    }

    static findByUser(req, res) {
        Todo
            .findById(req.params.id)
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err)
            })

    }

    static findAll(req, res) {
        // console.log('req auth', req.authenticatedUser)
        let query = {}
        if (req.query) {
            // console.log('pake query')
            let arr = []
            let field = Object.keys(req.query)
            field.forEach((keyword) => {
                arr.push({
                    [keyword]: { $regex: new RegExp(req.query[keyword], "i") }
                })
            })
            if (arr.length > 0) {
                query = { $or: arr }
            }
            // console.log(arr)
        }
        Todo.find({
            $and : [
                {userId : req.authenticatedUser.id},
                query
            ]
        })
        .then(todos => {
            res.status(200).json(todos)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

    static findChecked(req, res) {
        console.log('masuk sini')
        Todo.find({userId : req.authenticatedUser.id})
        .then(todos => {
            let checked = todos.filter(todo => {return todo.status == true})
            res.status(200).json(checked)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

    static findUnchecked(req, res) {
        Todo.find({userId : req.authenticatedUser.id})
        .then(todos => {
            let unchecked = todos.filter(todo => {return todo.status == false})
            res.status(200).json(unchecked)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }
}

module.exports = TodoController