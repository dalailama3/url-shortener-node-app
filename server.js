var utils = require('./utilities.js')
var express = require('express')
var mongoose = require('mongoose')
var mongoUrl = process.env.MONGOLAB_URI
console.log(mongoUrl)


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
      entry._id = counter.seq;
      entry.created_at = new Date();
      next();
  });
});

var Url = mongoose.model('Url', urlSchema)


mongoose.connect(mongoUrl);

app.get('/', function (req, res) {
    res.send('Enter url as the parameter after /new, and receive a shortened url!')
})


app.get('/new/:longurl', function (req, res) {
    var shortUrl = ''
    var longUrl = req.params['longurl']
    Url.findOne({long_url: longUrl}, function (err, doc) {
        if (doc) {
            shortUrl = 'https://aqueous-sierra-51876.herokuapp.com/' + utils.base10To58(doc._id)
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
                    shortUrl = "https://aqueous-sierra-51876.herokuapp.com/" + utils.base10To58(newUrl._id)
                    res.send({
                    'longurl': newUrl.long_url,
                    'shorturl': shortUrl
                    
                })
               }
            });
        }
    })
    
})


app.get('/:encoded', function (req, res) {
    var str = req.params['encoded']
    console.log(str)
    var id = utils.strToBase10(str)
    console.log(id)
    Url.findOne({ _id: id }, function (err, doc) {
        if (err) {
            console.log(err)
        }
        if (doc) {
            console.log(doc)
            console.log(doc.long_url.toString())
            // return res.redirect('http://google.com')
            window.location.href = doc.long_url

        } else {
            res.redirect("/shitshow")
        }
    })
   
})


app.listen(process.env.PORT || '8080')

