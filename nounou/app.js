
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
/*Environnement de test*/
mongoose.connect("mongodb://localhost:27017/nounou");
/*Environnement de Production Azure*/
//var connectionString =process.env.CUSTOMCONNSTR_MONGOLAB_URI;
//mongoose.connect(connectionString);
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

/*routes api*/
var routes = require('./routes/apiRoutes')(app);


/*var nounou=new Nounou({nom:"testGeopoint",prenom:"stef",dateDeNaissance:"20/09",civilite:"civil",adresse:"Berlin",email:"dupre@stef.fr",tarifHoraire:"tarif horaire",
    description:"desc",telephone:"0122334455",disponibilite:"dispo",cheminPhoto:"photo",password:"pass"});

nounou.save(function(err,doc){
    if(err){
        console.log(" error no validation ");
    }
    else{
        console.log("success");
    }
});
*/
/*var client= new Client({pseudo:"test",password:"azerty5AZERTY"});
client.save(function(err,doc){
    if(err){
        console.log("erreur save client ");
    }
    else{
        console.log("client enregistré");
    }
});

*/
/*
var stamp= new Timestamp({timestamp:"1",client:"abcd4ABCD"});
stamp.save(function(err,doc){
   if(err) {
       console.log("erreur save time ");
   }
    else
   {
       console.log("time enregistré");
   }
});
*/
/*var geoPoint =new geoPoint({longitude:1,latitude:2});
geoPoint.save(function(err,doc){
   if(err){
       console.log("geopoint non sauvegardé");

   }
    else{
       console.log('geopoint sauvegardé');
   }
});
*/

  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server ecoute sur le port ' + app.get('port'));
});


