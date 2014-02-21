/**
 * Created by John on 07/02/14.
 */
var mongoose = require('mongoose');

var nounouSchema = mongoose.Schema({
    nom:{type : String},
    prenom:{type:String},
    dateDeNaissance:{type:String},
    civilite:{type:String},
    adresse:{type:String,required:true},
    email:{type:String,required:true},
    tarifHoraire:{type:String},
    descriptionPrestation:{type:String},
    telephone:{type:String}
});

var Nounou = mongoose.model('Nounou',nounouSchema);

global.Nounou = Nounou;