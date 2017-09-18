var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser=require('body-parser');
var formidable = require('express-formidable');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(formidable());

app.get('/' , function(req,res){
    res.sendFile(__dirname+'/form.html');
})

app.post('/', function(req,res){
   console.log(req.fields); 
   console.log(req.files)
})


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});