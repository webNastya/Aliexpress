const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://root:hoRYEGRpiQFNH46u@cluster0.cfp4c.mongodb.net/";

let db;

module.exports = {
    connect: function( callback ) {
        MongoClient.connect( url,  {useUnifiedTopology: true, useNewUrlParser: true}, function( err, client ) {
            console.log(err)
            db = client.db('Aliexpress');
            return callback( err );
        } );
    },
    get: function() {
        return db;
    }
};
