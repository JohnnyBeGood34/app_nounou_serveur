
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

/*routes api*/
var routes = require('./routes/apiRoutes')(app);


var nounou=new Nounou({nom:"testDate",prenom:"stef",dateDeNaissance:"20/09",civilite:"civil",adresse:"adresse",email:"dupre@stef.fr",tarifHoraire:"tarif horaire",
    description:"desc",telephone:"0122334455",disponibilite:"dispo",cheminPhoto:"photo",password:"pass"});

nounou.save(function(err,doc){
    if(err){
        console.log(" error no validation ");
    }
    else{
        console.log("success");
    }
});


  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server ecoute sur le port ' + app.get('port'));
});

