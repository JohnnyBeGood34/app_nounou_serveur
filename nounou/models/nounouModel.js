/**
 * Created by John on 07/02/14.
 */
var mongoose = require('mongoose');

var nounouSchema = mongoose.Schema({
    nom:{type : String,required:true},
    prenom:{type:String,required:true},
    dateDeNaissance:{type:String},
    civilite:{type:String,required:true},
    adresse:{type:String,required:true},
    email:{type:String,required:true},
    tarifHoraire:{type:String,required:true},
    descriptionPrestation:{type:String},
    telephone:{type:String},
    disponibilite:{type:String,required:true},
    cheminPhoto: {type:String},
    password : {type:String,required:true}

});

var Nounou = mongoose.model('Nounou',nounouSchema);


/*
Nounou.schema.path('email').validate(function(value){

       return /^[a-z0-9]+@[a-z]{2,}.[a-z]{2,4}$/.test(value);
    }
    ,console.log('Email invalide'));




Nounou.schema.path('tarifHoraire').validate(function(value){
    console.log("tarif horaire ="+value);
    return /^[0-20]/.test(value);


},'Tarif horaire unvalide');



Nounou.schema.path('telephone').validate(function(value){
        console.log("Téléphone = "+value);
        return /^0[0-9]{9}$/.test(value);
    }

    ,"Téléphone invalide");

/*
Nounou.schema.path('dateDeNaissance').validate(function(value){
        console.log("Date de Naissance = "+value);
        return /[1-31][/][0-12]/.test(value);
    }

    ,"Date de naissance invalide");
*/
global.Nounou = Nounou;

