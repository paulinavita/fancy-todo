require('dotenv').config()

const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const routes = require('./routes')
const uri = `mongodb+srv://paulina:paulina@fancytodo-qvjsj.mongodb.net/test`

mongoose.connect(uri, { 
  useNewUrlParser: true,
  useCreateIndex: true 
})
.then(() => console.log(`=======Mongo CONNECTED========`))
.catch(err => console.log(err))



app
    .use(express.json())
    .use(express.urlencoded({extended : true}))
    .use(cors())

app.use('/', routes)

app.listen(port, function() {
    console.log(`Listening on port ${port}...`)
})

