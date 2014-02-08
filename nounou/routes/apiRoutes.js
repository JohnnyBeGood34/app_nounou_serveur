/**
 * Created by JOHNNY on 08/02/14.
 */
var api = require('../controllers/api');

/*Fonction qui vérifie si les paramètres
*reçuts correspondent à ceux attendus
*/
function checkParams(received, expected) {
    var allParamsReceived = true;
    if (expected != undefined && expected.length > 0) {
        expected.forEach(function(expected){
            if (!received.hasOwnProperty(expected)) {
                allParamsReceived = false;
            }
        })
    }
    return allParamsReceived;
}
module.exports = function (app) {

    /*Retourne la liste de toutes les nounous de la base de données*/
    app.get('/api/nounous', function (req, res){
        return api.getNounous(req,res);
    });

    /*Creation d'une nounou*/
    app.post('/api/nounous',function(req,res){
        /*Check des parametres reçut (obligatoires)*/
        if (checkParams(req.body, ["nom","prenom","dateDeNaissance","civilite","adresse","email","tarifHoraire","descriptionPrestation","tarifhoraire"])) {
            return api.createNounou(req,res);
        } else {
            return res.respond(406);
        }

    });

    /*Toute requetes non implémentées dans l'api*/
    app.all('/api/?*', function (req, res) {
        res.respond(405);
    });
}