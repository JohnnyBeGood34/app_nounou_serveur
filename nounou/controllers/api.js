/**
 * Created by JOHNNY on 08/02/14.
 */
/*Variables déclaration*/
var mongoose = require('mongoose');

/**/
module.exports = {
    getNounous : function(req,res){
        return Nounou.find(function (err, nounous) {
            if (!err) {
                return res.send(nounous,200);
            } else {
                return res.send(err,500);
            }
        });
    },
    createNounou : function(req,res){
        var body = req.body,
            newNounou;
        /*Log console*/
        console.log("POST : Creation d'une nounou :");
        console.log(body);
        /*Creation du modèle*/
        newNounou = new Nounou({nom:body.nom,prenom:body.prenom,dateDeNaissance:body.dateDeNaissance,civilite:body.civilite,adresse:body.adresse,email:body.email,tarifHoraire:body.tarifHoraire,descriptionPrestation:body.descriptionPrestation,tarifhoraire:body.tarifhoraire});
        newNounou.save(function (err, doc) {
            if (err) {
                res.respond(406);/*Les parametres reçut ne sont pas acceptables*/
            } else {
                res.send({"status": 200, "error": null});
            }

        });
    }
}