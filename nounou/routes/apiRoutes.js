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
        if (checkParams(req.param, ['time', 'login', 'signature'])) {
                return api.getNounous(req, res);
        }
        else {
            return res.respond(403);
        }

    });

    /*Creation d'une nounou*/
    app.post('/api/nounous', function (req, res) {
        /*Check des parametres reçut (obligatoires)*/
        if (checkParams(req.body, ["nom", "prenom", "dateDeNaissance", "civilite", "adresse", "email", "tarifHoraire", "descriptionPrestation", "telephone", "disponibilite", "cheminPhoto", "password"])) {
            if (identite.verifieIdentite(req)) {
                console.log("c bon")
                return api.createNounou(req, res);
            }/*
            else {
                //return res.respond(401);
                console.log('erreur auth')
            }*/
        } else {
            return res.respond(406);
        }
    });

    /*Retourne un objet nounou*/
    app.get('/api/nounou/:id', function (req, res) {
        if (checkParams(req.param, ['time', 'login', 'signature', 'idNounou'])) {

            return api.getOneNounou(req, res);

        }
        else {
            return  res.respond(403);
        }
    });

    /*Update d'une nounou*/
    app.put('/api/nounou/:id', function (req, res) {
        /*Check des parametres obligatoires*/
        if (checkParams(req.body, ["nom", "prenom", "dateDeNaissance", "civilite", "adresse", "email", "tarifHoraire", "descriptionPrestation", "telephone", "disponibilite", "cheminPhoto", "password"])) {
            if (checkParams(req.param, ['time', 'login', 'signature'])) {
                if (identite.verifieIdentite(req)) {
                    return api.updateNounou(req, res);
                }
                else {
                    return res.respond(401);
                }
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
            if (identite.verifieIdentite(req)) {
                return api.removeNounou(req, res);
            }
            else {
                return res.respond(401);
            }
        }
        else {
            return res.respond(403);
        }
    });

    /*Toute requetes non implémentées dans l'api*/
    app.all('/api/?*', function (req, res) {
        res.respond(405);//renvoie le code erreur 405 Method not allowed
    });
}