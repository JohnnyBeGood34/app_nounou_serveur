
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/nounou");
var app = express();
require('./response');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*Routes*/
app.get('/', routes.index);
app.get('/users', user.list);

/*Load models*/
require("./models/nounouModel");
require("./models/timestampModel");
require("./models/clientModel");
/*Test creation bdd structure/

var client = new Client({pseudo:"abcd4ABCD",password:"azerty5AZERTY"});
client.save(function(err,doc){
    if (err) {
        console.log({"status": false, "error": err});
    } else {
        console.log({"status": true, "error": null});
    }
});
/*
var timestamp = new Timestamp({timestamp:"1392975942965",client:"abcd4ABCD"});
timestamp.save(function(err,doc){
    if (err) {
        console.log({"status": false, "error": err});
    } else {
        console.log({"status": true, "error": null});
    }});*/
/*
var testNounou=new Nounou({nom:"testTel",prenom:"test",dateDeNaissance:"1983",civilite:"Monsieur",
    adresse:"aaa",email:"aaaa",tarifHoraire:"20",descriptionPrestation:"aaa",telephone:"012233445",
disponibilite:"tout le temps",cheminPhoto:"url"});

testNounou.save(function (err, doc) {
    if (err) {
        console.log(err.errors);
    }

    else {
        console.log({'status': true, "error": null});
    }
});
*/
/*routes api*/
var routes = require('./routes/apiRoutes')(app);


/**Test hmac pour authentification rest*/
var crypto    = require('crypto');
var text      = 'jaime les queues';
var key       = 'bonjourbonsoir';
var algorithm = 'sha1';
var hash, hmac;
hmac = crypto.createHmac(algorithm, key);
hmac.setEncoding('hex');
hmac.write(text);
hmac.end();
hash = hmac.read();
console.log(hash);


  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server ecoute sur le port ' + app.get('port'));
});
