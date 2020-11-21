const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://root:hoRYEGRpiQFNH46u@cluster0.cfp4c.mongodb.net/";

let db;

module.exports = {
    connect: function( callback ) {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
            db = client.db('Aliexpress');
            return callback( err );
        } );
    },
    db: function() {
        return db;
    }
};
