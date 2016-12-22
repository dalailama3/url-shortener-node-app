var utils = require('./utilities.js')
var express = require('express')

var app = express()

var mongo = require('mongodb').MongoClient

app.get('/', function (req, res) {
    res.send('Enter url as the a parameter, and receive a shortened url!')
})

app.get('/:longurl', function (req, res) {
   
})

app.post('/api/shorten', function (req, res) {
    
})

app.listen(process.env.PORT || '8080')

