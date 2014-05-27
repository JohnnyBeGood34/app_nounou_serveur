/**
 * Created by JOHNNY on 08/02/14.
 */
var api = require('../controllers/api');
var identite = require('../controllers/verifieIdentite');
/*Fonction qui vérifie si les paramètres
 *reçuts correspondent à ceux attendus
 */
function checkParams(received, expected) {
    var allParamsReceived = true;
    if (expected != undefined && expected.length > 0) {
        expected.forEach(function (expected) {
            if (!received.hasOwnProperty(expected)) {
                allParamsReceived = false;
            }
        })
    }
    return allParamsReceived;
}

module.exports = function (app) {


	/*Identification d'une nounou : vérification du mot de passe
	 *
	 * */
	app.post('/api/connexionNounou',function(req,res){
		if(checkParams(req.body,['email','password'])){
			return api.identification(req,res);
		}
		else{
			return res.respond(403);
		}
	});

    /***Retourne la liste de toutes les nounous ordonées par distance selon les coordonnées Latitude et longitude reçus
     *
     * */
    app.get('/api/nounous/latitude/:lat/longitude/:lng', function (req, res) {

            return api.getNounous(req,res);
    });

	/***Retourne la liste des nounous dans un rayon donné
	 *
	 * */
    app.get('/api/nounous/latitude/:lat/longitude/:lng/kilometres/:km',function(req,res){

	    return api.getNounousAround(req,res);
    });

    /*Creation d'une nounou
    *
    * */
    app.post('/api/nounous', function (req, res) {
        /*Check des parametres reçut (obligatoires)*/
        if (checkParams(req.body, ["nom", "prenom", "dateDeNaissance", "civilite", "adresse", "email", "tarifHoraire", "descriptionPrestation", "telephone", "disponibilite", "cheminPhoto", "password"])) {

            identite.verifieIdentite(req, function (response) {
                if (response) {
                    return api.createNounou(req, res);
                } else {
                    return res.respond(401);
                }
            });

        } else {
            return res.respond(406);
        }
    });

    /*Retourne un objet nounou par rapport à son Id passé en paramètre
    *
    * */
    app.get('/api/nounou/:id', function (req, res) {
            return api.getOneNounou(req, res);
    });

    /*Update d'une nounou par rapport à son Id
    *
    * */
    app.put('/api/nounou/:id', function (req, res) {

	    console.log("Params time :"+req.param('time'));
	    console.log("Params login :"+req.param('login'));
	    console.log("Params signature :"+req.param('signature'));
	    console.log("Body :"+req.body['nom']);
        /*Check des parametres obligatoires*/

        if (checkParams(req.body, ["nom", "prenom", "dateDeNaissance", "civilite", "adresse", "email", "tarifHoraire", "descriptionPrestation", "telephone", "disponibilite", "cheminPhoto", "password"])) {

	        console.log('Param body ok');

            if (checkParams(req.params, ['time', 'login', 'signature'])) {

	            console.log('Param url ok');
                identite.verifieIdentite(req, function (response) {
                    if (response) {
                        return api.updateNounou(req, res);
                    } else {
                        return res.respond(401);
                    }
                })
            }
            else {
                return res.respond(403);
            }
        }
        else {
            return res.respond(406);
        }
    });

    /*Supprime un objet nounou par rapport à son Id
    *
    * */
    app.delete('/api/nounou/:id', function (req, res) {
        if (checkParams(req.param, ['time', 'login', 'signature', 'idNounou'])) {
            identite.verifieIdentite(req, function (response) {
                if (response) {
                    return api.removeNounou(req, res);
                } else {
                    return res.respond(401);
                }
            })
        }
        else {
            return res.respond(403);
        }
    });



	/*
	*Test save photo uploadée
	* */
	app.post('/api/image',function(req,res){

		return api.saveImage(req,res);
	})


    /*Toute requetes non implémentées dans l'api renvoie le code erreur 405 Method not allowed
    *
    * */
    app.all('/api/?*', function (req, res) {
	    /**/
        res.respond(405);
    });
}