/**
 * Created by JOHNNY on 15/02/14.
 */
var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
    pseudo : {type:String,required:true},
    password:{type:String,required:true}
})

var Client = mongoose.model('Client',clientSchema);

global.Client=Client;