/**
 * Created by JOHNNY on 08/02/14.
 */
/*Variables déclaration*/
var mongoose = require('mongoose');

var geolib = require('geolib');
var eachAsync=require('each-async');
var fs=require('fs');

/*API : toutes les fonctions appelées dans l'apiRoutes.js*/
module.exports = {

	/*
	* Fonction de vérification du mot de passe
	* */
    identification:function(req,res){

        Nounou.findOne({email:req.body['email']},function(err,nounou){
            if(err || nounou == null){
	            /*On renvoie not found si l'email ne correspond à aucune NOunou*/
                return res.send({"code":404,"status":404, "message":"not found"});
            }
            else{
                if(nounou.password == req.body['password']){
                    /*On renvoie Ok si les mots de passe correspondent*/
	                res.send({"code":200,"status":200, "message":nounou._id});
                }
                else{
	                /*On renvoie Unauthorized*/
	                res.send({"code":401,"status":401, "message":null});
                }
            }
        });

    },
    getAllNounous : function(req,res){
        Nounou.find(function(err,json){
            if(err){
                return res.send({"code":404,"status":404, "message":"not found"});
            }
            else{
                //Si on appele le get all nounou c'est qu'il n'y a pas de GPS donc distance = 0
                eachAsync(json,function(element,index,done){
                    element.distance = "0";
                    done();
                });
                res.send({allNounous:json});
            }
        }).limit(50);
    },
    /*Renvoie les nounous ordonnées par distance à 100 km par défaut
    *
    * */
    getNounous : function(req,res){
         getNounousNear(req,res);
    }
    ,

	/*Renvoie les nounous dans un rayon donné
	 *
	  * */
	getNounousAround:function(req,res){
           getNounousNear(req,res);
	}
     ,
	/*
	* Création d'une nounou
	* */
    createNounou : function(req,res){
        var body = req.body,
            newNounou;

        newNounou = new Nounou({nom:body.nom,prenom:body.prenom,dateDeNaissance:body.dateDeNaissance,civilite:body.civilite,
            adresse:body.adresse,ville:body.ville,email:body.email,tarifHoraire:body.tarifHoraire,descriptionPrestation:body.descriptionPrestation,
            telephone:body.telephone,disponibilite:body.disponibilite,cheminPhoto:body.cheminPhoto,password:body.password});

        newNounou.save(function (err, nounou) {

            if (err) {
	                    //Erreur spécifique l'addresse n'a pas été trouvé par Googlemaps
	                    if(err.address == 404){
		                    res.send({"code":404,"status": 404, "message":404});
		                    console.log("Addresse non valide");
	                    }
                     else   res.respond(405);/*Les parametres reçut ne sont pas acceptables*/

            } else {
	            res.send({"code":200,"status":200, "message":nounou._id});
            }

        });
    },

   /*
   *Renvoie une nounou par rapport à son Id
   * */
    getOneNounou : function(req,res){

        var idNounou = req.param('id');
        //console.log("idNounou ="+idNounou);
        Nounou.findById(idNounou,function(err,nounou){
            if(err)
            {
                res.respond(404);/*L'id envoyé n'existe pas*/
            }
            else
            {
                res.send(nounou);
            }
        });
    },

	/*
	* Mise à jour d'une nounou
	* */
    updateNounou : function(req,res){
        var idnounou = req.param('id'),
            body = req.body;
        Nounou.findById(idnounou,function(err,nounou){
            if(err || nounou.isNull){//Si on a une erreur ou que l'objet n'est pas construit
                res.respond(404); //on renvoie une erreur 404 Nounou non trouvée
        }
            else
            {
                //affectation des nouveaux paramètres
                nounou.nom = body.nom;
                nounou.prenom = body.prenom;
                nounou.dateDeNaissance = body.dateDeNaissance;
                nounou.civilite = body.civilite;
                nounou.adresse = body.adresse;
	            nounou.ville= body.ville;
                nounou.email = body.email;
                nounou.tarifHoraire = body.tarifHoraire;
                nounou.descriptionPrestation = body.descriptionPrestation;
                nounou.telephone = body.telephone;
                nounou.disponibilite = body.disponibilite;
                nounou.cheminPhoto = body.cheminPhoto;
                nounou.password = body.password;
                /*Sauvegarde des modifications*/
                nounou.save(function(err,doc){

                    if(err){//Si il y a une erreur lors du save

	                         //Erreur spécifique l'addresse n'a pas été trouvé par Googlemaps
	                        if(err.address == 404){

		                        res.send({"code":404,"status": 404, "message":404});
		                        console.log("Addresse non valide");
	                        }
                            else res.send({"code":404,"status": 404, "message": "error"});
                    }

                    else{
	                    res.send({"code":200,"status":200, "message":null});
                    }
                });
            }
        });
    },


	/*
	*Suppression d'une nounou
	* */
    removeNounou : function(req,res){
        var idnounou = req.param('id');
        Nounou.findById(idnounou,function(err,nounou){
            if(err || nounou.isNull)
            {
                res.respond(405);//L'id renvoyé pas la route n'est pas le bon
            }
            else
            {
                nounou.remove(function(err){
                    if(err)
                    {
                        res.send({"code":404,"status": 404, "message": "error"});
                    }
                    else
                    {
	                    deleteImage(nounou._id);
                        res.send({"code":200,"status": 200, "message": null});
                    }
                });
            }
        });
    },

    /*
    * Fonction test save image uploadée
    * */
	saveImage:function(req,res){


		fs.readFile(req.files.image.path,function(err,data){

			var nomImage=req.param('id');
			// req.files.image.name;

			if(err) res.send("Probleme de lecture de fichier :"+err);

			fs.writeFile('./public/images/'+nomImage+".png",data,function(err){
				if(err) {

					res.send({"code":500,"status": 500, "message": null});
				}

				res.send({"code":200,"status": 200, "message": null});
			});

		});
	}
	,

	/*Retourne les coordonnées selon l'ID de la nounou */
	getLatLngById:function(req,res){

		var id=req.param('id');

		Nounou.findById(id,function(err,nounou){

			if(!err){
				res.send({latitude:nounou.localisation[0].latitude,
					     longitude:nounou.localisation[0].longitude});
			}
			else res.send({"code":404,"status":404,"message":"not found"});
		})
	}


}


/*
* Fonction permettant d'effacer l'image de profil d'une Nounou en fonction de son id
* */
 function deleteImage(idNounou){

	fs.unlink('./public/images/'+idNounou+".png");
}

/*Fonction appelée pour les fonctions de géolocalisation getNounous et getNounousAround
*
*
* */

function getNounousNear(req,res){

	var coordAllNounous=new Object();
	var nounousOrdered=new Array();
	var coordClient={latitude:req.param('lat'),longitude:req.param('lng')};
	var distance=parseInt(req.param('km'));
	distance= isNaN(distance) ? 100:distance;//Si pas de param km distance est égal à 100


	Nounou.find(function(err,nounous){
		if(!err){

			for(var i in nounous){

				var idClé=nounous[i]._id;
				/*
				Fonction GeoLib qui renvoie vrai si le Param 1 est dans le rayon (param3) du param 2
				 Param 1 : coordonnées du point à comparer
				 Param 2 : coordonnées du point de départ
				 Param 3 : Distance du cercle en mètres
				 */
				if(geolib.isPointInCircle(
					{longitude:nounous[i].localisation[0].longitude,latitude:nounous[i].localisation[0].latitude},
					 coordClient,
					 distance*1000
				))
				{
					//On construit un objet des coordonées de toutes les nounous avec leur ID en clé
					coordAllNounous[idClé]=
					{longitude:nounous[i].localisation[0].longitude,latitude:nounous[i].localisation[0].latitude}
				}
			}

		}//
		else  return res.send(err,404);

		/*
		 * Param 1: les coordonées à du point de départ
		 * Param 2: Array ou Object des coordonées à  trier par rapport au point de départ
		 * */
		var ordered=geolib.orderByDistance(coordClient,coordAllNounous);

		eachAsync(ordered,function(coord,index,done){

				Nounou.findById(coord.key,function(err,nounou){

					if(!err){
						/*Ajout de la distance dans le Schema entre le client et cette Nounou*/
						nounou.distance=geolib.convertUnit('km',coord.distance,0);
						nounousOrdered[index]=nounou;
						done();
					}
					else  return res.send(err,404);
				})
			},

			/*Fonction appelée une fois le foreach fini*/
			function(){
				res.send({allNounous:nounousOrdered},200);
			}
		)//Foreach

	});

}