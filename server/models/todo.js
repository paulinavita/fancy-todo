const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Task name cannot be empty']
    }, 
    description : {
        type : String,
        required : [true, 'Description name cannot be empty']
    },
    status : {
        type : Boolean,
        required : [true],
        default : false
    }, 
    createdAt : {
        type: Date
    },
    dueDate : {
        type: Date,
        required : [true, 'Due date must be filled']

    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo