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

    /*Retourne la liste de toutes les nounous de la base de données*/

    app.get('/api/nounous', function (req, res) {
            return api.getNounous(req, res);

    });

    /*Creation d'une nounou*/
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

    /*Retourne un objet nounou*/
    app.get('/api/nounou/:id', function (req, res) {
            return api.getOneNounou(req, res);
    });

    /*Update d'une nounou*/
    app.put('/api/nounou/:id', function (req, res) {
        /*Check des parametres obligatoires*/
        if (checkParams(req.body, ["nom", "prenom", "dateDeNaissance", "civilite", "adresse", "email", "tarifHoraire", "descriptionPrestation", "telephone", "disponibilite", "cheminPhoto", "password"])) {
            if (checkParams(req.param, ['time', 'login', 'signature'])) {
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

    /*Supprime un objet nounou*/
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

    app.post('/api/connexionNounou',function(req,res){
             if(checkParams(req.body,['email','password'])){
                 return api.checkConnection(req,res);
             }
        else{
                 return res.respond(403);
             }
    });

    /*Toute requetes non implémentées dans l'api*/
    app.all('/api/?*', function (req, res) {
        res.respond(405);//renvoie le code erreur 405 Method not allowed
    });
}