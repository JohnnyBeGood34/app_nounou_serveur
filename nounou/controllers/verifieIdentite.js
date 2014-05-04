/**
 * Created by JOHNNY on 21/02/14.
 * permet de vérifier l'identite du client
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    key = 'bonjourbonsoir',
    algorithm = 'sha1',
    hash="",
    hmac;
require("../models/timestampModel");
module.exports = {

    verifieIdentite: function (req,callback) {

        var body = req.body,
            timestamp = req.param('time'),
            login = req.param('login'),
            signature = req.param('signature'),
            text="";

          var result = true;

        /*Find du client*/
        Client.findOne({pseudo: login}, function (err, client) {

            if (err)//Si on en trouve pas le client
            {
                console.log('client non trouve');
                callback(false)//On retourne false
            }
            else {
                var password = client.password;
                //console.log(password)
                Timestamp.find({client: client.pseudo}).sort({_id: 'descending'}).limit(1).exec(function (err, docTimestamp) {//On récupère le dernier timestamp du client
                    var stamp= new Timestamp({timestamp:timestamp,client:login});
                    console.log('Login :'+login);

                    stamp.save(function(err,doc){

                        if(err){
                            console.log("time stamp non enregistré");
                            callback(false);
                        }
                        else{
                            console.log("time stamp saved");
                            var timestampClient;
                            if (!docTimestamp.length) {//Si c'est la première requete du client
                                timestampClient = 0;
                            }
                            else {
                                timestampClient = docTimestamp[0];
                            }
                            console.log('Time stamp BDD :'+timestampClient.timestamp);
                            if (parseInt(timestampClient.timestamp) < parseInt(timestamp))//Si le timestamp en base est plus petit que le timestamp reçut
                            {

                                /*Vérification signature*/
                                Object.keys(body).forEach(function (key) {
                                    text += body[key];
                                });

                                text += password;

                                console.log("====================="+text);
                                text+= timestamp;

                                hmac = crypto.createHmac(algorithm, key);
                                hmac.setEncoding('hex');
                                hmac.write(text);
                                hmac.end();
                                hash = hmac.read();



                                //console.log("Signature type "+signature);
                                console.log("Hash --------------"+hash);
                                if (hash == signature) //Si les signatures correspondent
                                {
                                    console.log('Bonne signature')
                                    //callback(true)

                                }
                                else{
                                    console.log('Mauvaise signature');
                                    callback(false);

                                }
                            }
                            else //Sinon on retourne false, car celà veut dire que la requete à déjà été envoyée
                            {

                                console.log('timestamp degueulasse');
                                callback(false)

                            }
                        }
                    });//Fin ajout imestamp
                });//Fin Timestamp find
                
            }
        });//Fin Client find

    }//Fin VerifIdentite
}