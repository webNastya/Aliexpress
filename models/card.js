const db = require('../db').get();
const ObjectId = require('mongodb').ObjectID;

exports.getCard = (req, res, callback)=>{
    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").findOne({id: req.query.id});
    let favoritesCnt = 0;

    cardsCursor.then((card)=>{
        profileCursor.then(profile => {
            if (profile != null) {
                favoritesCnt = profile.favorites.length;
                card.inFavorites = profile.favorites.includes(card.id);
            }
            let data = {
                card: card,
                favoritesCnt: favoritesCnt,
                layout: "card"
            };
            callback(data);
        });
    });
}
exports.postCard = (req, res, callback)=> {
    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").findOne({id: req.body.id});

    cardsCursor.then((card)=>{
        profileCursor.then(profile => {
            if (profile != null)
                card.inFavorites = profile.favorites.includes(card.id);
            let data = {
                card: card
            };
            callback(data);
        });
    });
}
