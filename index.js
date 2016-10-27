console.log('running 1st line');
var firebase = require("firebase");
var express = require("express");
var gcloud = require("google-cloud");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//app.set('view engine', 'ejs');
//app.get('/', function(request, response) {
  
//});

firebase.initializeApp({
    serviceAccount: "privkey.json",
    databaseURL: "https://bookrecycle-5b8d1.firebaseio.com/"
});
/**
 * Google cloud storage part
 */
var CLOUD_BUCKET="bookrecycle-5b8d1.appspot.com"; //From storage console, list of buckets
var gcs = gcloud.storage({
    projectId: '12019208667', //from storage console, then click settings, then "x-goog-project-id"
    keyFilename: 'privkey.json' //the key we already set up
});


function getPublicUrl (filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}

var bucket = gcs.bucket(CLOUD_BUCKET);

//From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
function sendUploadToGCS (req, res, next) {
    if (!req.file) {
        return next();
    }

    var gcsname = Date.now() + req.file.originalname;
    var file = bucket.file(gcsname);


    var stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', function (err) {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', function () {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        var options = {
            entity: 'allUsers',
            role: gcs.acl.READER_ROLE
        };
        file.acl.add(options, function(a,e){next();});//Make file world-readable; this is async so need to wait to return OK until its done
    });

    stream.end(req.file.buffer);
}


var port = process.env.PORT || 3000;
console.log('running fine');
//app.listen(3000, function () {
//  console.log('Example app listening on port 3000!');
//});
app.post('/postTextbook', function (req, res) {
    console.log("User wants to create posting: '" + req.body.titlep + "'");
	firebase.database().ref('school/' + req.body.schoolp + '/' + req.body.coursep).push({
		sellerID: req.body.userIDp,
		title: req.body.titlep,
		author: req.body.authorp,
		price: req.body.pricep,
		isbn: req.body.isbnp,
		note: req.body.notep
		});
	console.log("done post textbook");
		
});

app.post('/createUserInfo', function (req, res){
	console.log("Create info of user "+ req.body.firstnamep + " " + req.body.lastnamep);
	firebase.database().ref('users/' + req.body.userIDp).set({
		firstName: req.body.firstnamep,
		lastName: req.body.lastnamep,
		school: req.body.schoolp,
		email: req.body.emailp,
		phone: req.body.phonep
	});
	console.log("done create user");
});

var fireRef = firebase.database().ref('uploads');
//Make a new one
app.post('/upload', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    var data = {"text" : req.body.todoText};
    if(req.file)
        data.img = getPublicUrl(req.file.cloudStorageObject);
    fireRef.push(data, function () {
        res.send("OK!");
    }).catch(function(){
        res.status(403);
        res.send();
    });
});

/*
app.post('/newTodo', function (req, res) {
    console.log("New req");
    console.log("Client wants to create todo: '" + req.body.todoText + "'");
    fireRef.push({"text": req.body.todoText}, function () {
        res.send("OK!");
    }).catch(function(){
        res.status(403);
    });
});
app.post('/editTodo', function (req, res) {
    console.log("Client wants to update todo: '" +req.body.key+ " To " + req.body.todoText + "'");
    if(req.body.todoText.toLowerCase().includes("lasagna"))
        res.status(403);
    else
        fireRef.child(req.body.key).set({"text": req.body.todoText}, function () {
            res.send("OK!");
        }).catch(function(){
            res.status(403);
        });
});
app.post('/deleteTodo', function (req, res) {
    console.log("Client wants to delete todo: '" +req.body.key);
    fireRef.child(req.body.key).once("value", function(item){
        if(item.val().text.toLowerCase().includes("lasagna"))
            res.status(403);
        else
        {
            fireRef.child(req.body.key).remove();
            res.send("OK!");
        }
    }).catch(function(){
        res.status(403);
    });
});
app.get('/emptyHtml.html', function (req, res) {
    console.log("Requested empty html");
    res.send("OK!");
});
*/

app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});