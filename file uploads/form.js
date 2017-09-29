var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser=require('body-parser');
var formidable = require('formidable');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/' , function(req,res){
    res.sendFile(__dirname+'/form.html');
})

app.post('/', function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields,files){
        
        //fields parameter is an object with key as the name of the input[text] field
        //files is an object with key as the name of the input[file] field
        console.log("Form Parsing completed")
        res.sendFile(__dirname+'/form.html')
    });
    form.on('error', function(err) {
        console.error(err);
    });
    form.on('fileBegin', function (name, file){
        console.log("File uplodaing started");
        
        file.path = __dirname + '/uploads/' + file.name;
    });
     form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });
    form.on('progress', function(bytesReceived,bytesExpected){
        console.log(bytesReceived/bytesExpected)
    })
    // form.on('end', function(fields, files) {
    //     console.log(fields,files);
    //     // console.log(form);
    //     /* Temporary location of our uploaded file */
    //     var temp_path = this.openedFiles[0].path;
    //     // /* The file name of the uploaded file */
    //     var file_name = this.openedFiles[0].name;
    //     // /* Location where we want to copy the uploaded file */
    //     var new_location = __dirname+'/uploads';
 
    //     fs.rename(temp_path, new_location + file_name, function(err) {  
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             console.log("success!")
    //         }
    //     });
    // });
    form.on('end', function(){
        console.log("Form upload ended")
    })
})


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});