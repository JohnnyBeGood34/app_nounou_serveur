/**
 * Created by JOHNNY on 15/02/14.
 * timeStampModel stoque le timestamp envoyé par la requete client
 */
var mongoose = require('mongoose');

var timestampSchema = mongoose.Schema({
    timestamp : {type:String},
    client : {type:String}
});

var Timestamp = mongoose.model('Timestamp',timestampSchema);

global.Timestamp=Timestamp;