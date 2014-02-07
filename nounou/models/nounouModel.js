/**
 * Created by Easy on 07/02/14.
 */
var mongoose = require('mongoose');

var nounouSchema = mongoose.Schema({
    nom:{type : String,
    required:true},
    prenom:{type:String,
    required:true}
});

var Nounou = mongoose.model('Nounou',nounouSchema);

global.Nounou = Nounou;