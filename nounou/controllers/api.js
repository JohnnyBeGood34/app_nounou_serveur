/**
 * Created by JOHNNY on 08/02/14.
 */
/*Variables déclaration*/
var mongoose = require('mongoose');

/*fonctions de l'api pour android*/
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
        //console.log(body);
        /*Creation du modèle*/
        newNounou = new Nounou({nom:body.nom,prenom:body.prenom,dateDeNaissance:body.dateDeNaissance,civilite:body.civilite,
            adresse:body.adresse,email:body.email,tarifHoraire:body.tarifHoraire,descriptionPrestation:body.descriptionPrestation,
            telephone:body.telephone,disponibilite:body.disponibilite,cheminPhoto:body.cheminPhoto,password:body.password});
        newNounou.save(function (err, doc) {
            if (err) {
                res.respond(405);/*Les parametres reçut ne sont pas acceptables*/
            } else {
                res.send({"code":200,"status": 200, "message": "ok"});
            }

        });
    },
    getOneNounou : function(req,res){
        console.log("");
        var idNounou = req.param('id');
        console.log("idNounou ="+idNounou);
        Nounou.findById(idNounou,function(err,nounou){
            if(err)
            {
                res.respond(405);/*L'id envoyé n'existe pas*/
            }
            else
            {
                res.send(nounou);
            }
        });
    },
    updateNounou : function(req,res){
        var idnounou = req.param('id'),
            body = req.body;
        Nounou.findById(idnounou,function(err,nounou){
            if(err || nounou.isNull){//Si on a une erreur ou que l'objet n'est pas construit
                res.respond(405); //on renvoie une erreur 405 Invalid arguments
            }
            else
            {
                //affectation des nouveaux paramètres
                nounou.nom = body.nom;
                nounou.prenom = body.prenom;
                nounou.dateDeNaissance = body.dateDeNaissance;
                nounou.civilite = body.civilite;
                nounou.adresse = body.adresse;
                nounou.email = body.email;
                nounou.tarifHoraire = body.tarifHoraire;
                nounou.descriptionPrestation = body.descriptionPrestation;
                nounou.telephone = body.telephone;
                /*Sauvegarde des modifications*/
                nounou.save(function(err,doc){
                    if(err){//Si il y a une erreur lors du save
                        res.send({"code":500,"status": 500, "message": "error"});
                    }
                    else{
                        res.send(doc);//Sinon on renvoi l'objet nounou mis à jour
                    }
                });
            }
        });
    },
    removeNounou : function(req,res){
        var idnounou = req.param('id');
        Nounou.findById(idnounou,function(err,nounou){
            if(err || nounou.isNull)
            {
                res.respond(405);//L'id renvoyé pas la route n'est pas le bon
            }
            else
            {
                nonuou.remove(function(err){
                    if(err)
                    {
                        res.send({"code":500,"status": 500, "message": "error"});
                    }
                    else
                    {
                        res.send({"code":200,"status": 200, "message": null});
                    }
                });
            }
        });
    }
}