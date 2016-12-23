var utils = require('./utilities.js')
var express = require('express')
var mongoose = require('mongoose')

var app = express()

var mongo = require('mongodb').MongoClient
var Schema = mongoose.Schema

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema)

var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
});

urlSchema.pre('save', function (next) {
    var entry = this;
    counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error)
          return next(error);
      // set the _id of the urls collection to the incremented value of the counter
      entry._id = counter.seq;
      entry.created_at = new Date();
      next();
  });
});

var Url = mongoose.model('Url', urlSchema)

mongoose.connect('mongodb://localhost:27017/url_shortener');

app.get('/', function (req, res) {
    res.send('Enter url as the a parameter, and receive a shortened url!')
})

app.get('/:encoded', function (req, res) {
   
})

app.get('/new/:longurl', function (req, res) {
    var shortUrl = ''
    var longUrl = req.params['longurl']
    Url.findOne({longurl: longUrl}, function (err, doc) {
        if (doc) {
            shortUrl = "http://localhost:27017/" + utils.base10To58(doc._id)
            res.send({
                'longurl': doc.long_url,
                'shorturl': shortUrl
                
            })
        } else {
            var newUrl = Url({
                long_url: longUrl
            })
            
            newUrl.save(function (err) {
               if (err) {
                   console.log(err)
               } else {
                    shortUrl = "http://localhost:27017/" + utils.base10To58(doc._id)
                    res.send({
                    'longurl': doc.long_url,
                    'shorturl': shortUrl
                    
                })
               }
            });
        }
    })
    res.end(longUrl.toString())
})

app.listen(process.env.PORT || '8080')

