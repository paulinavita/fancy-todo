const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name cannot be empty'],
        minlength: [4, 'Minimum username character for username is 4'],
        validate: [{
            validator: function (username) {
                return User.findOne({
                    _id: {
                        $ne: this._id
                    }, username: username
                })
                    .then(found => {
                        if (found) return false
                    })
            }, message: `Username is taken`
        }]
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty'],
        minlength: [4, 'Minimum password length is 6']
    },
    email: {
        type: String,
        required: [true, 'Email must be filled'],
        unique: true,
        validate: [
            {
                validator:
                    function isEmail(email) {
                        console.log(email, 'nya ini ya')
                        return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i.test(email)
                    }, message: 'Not a valid email'
            }, {
                validator: function isUnique(email) {
                    return User.findOne({ _id: { $ne: this._id }, email: email })
                        .then(found => {
                            if (found) return false
                        })
                    }, message : `Email is already registered`
                }]
            }
        })

userSchema.pre('save', function (next) {
    if (this.password) {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(this.password, salt)
        this.password = hash
    }
    next()
})

// userSchema.post('validate', function (doc, next) {
//     var salt = bcrypt.genSaltSync(10)
//     var hash = bcrypt.hashSync(doc.password, salt)
//     doc.password = hash
//     next()
// })

const User = mongoose.model('User', userSchema)
module.exports = User