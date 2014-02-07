
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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/*Load models*/
require("./models/nounouModel");

/*Test creation bdd structure/*
var uneNounou = new Nounou({nom:"nom",prenom:"prenom",dateDeNaissance:"dateDeNaissance",civilite:"civilite",adresse:"adresse",email:"adresseEmail",tarifhoraire:"tarifhoraire",descriptionPrestation:"description",tarifhoraire:"tarif"});

uneNounou.save(function (err, doc) {
    if (err) {
        console.log({"status": false, "error": err});
    } else {
        console.log({"status": true, "error": null});
    }
});*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server ecoute sur le port ' + app.get('port'));
});
