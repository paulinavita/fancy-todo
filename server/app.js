require('dotenv').config()

const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const routes = require('./routes')


mongoose.connect('mongodb://localhost/fancy_todo', { 
  useNewUrlParser: true,
  useCreateIndex: true 
});


app
    .use(express.json())
    .use(express.urlencoded({extended : true}))
    .use(cors())

app.use('/', routes)

app.listen(port, function() {
    console.log(`Listening on port ${port}...`)
})

