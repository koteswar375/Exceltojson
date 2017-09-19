var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
// app.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "http://localhost");
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//         next();
//     });
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            // var datetimestamp = Date.now();
            cb(null, file.originalname)
        }
    });
var upload = multer({ //multer settings
                    storage: storage
                });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/js', express.static(__dirname+'/js'));

app.get('/' , function(req,res){
    res.sendFile(__dirname+'/form.html');
})

app.post('/upload', upload.any(),function(req,res,next){
  console.log(JSON.parse(req.body.field));
  console.log(req.files);
  res.send("Files uploaded successfully");
})
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});