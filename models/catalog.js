const db = require('../mongoUtil').db();
const ObjectId = require('mongodb').ObjectID;

exports.getCatalog = (req, res, callback)=>{
    let cards = Array();
    let favoritesCnt = 0;

    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").find({}).limit(20);
    cardsCursor
        .forEach((card) => {
            cards.push(card);
        }).then(() => {
            profileCursor.then(profile => {
                if (profile != null) {
                    favoritesCnt = profile.favorites.length;
                    profile.favorites.forEach(id => {
                        for (let i = 0; i < cards.length; i++) {
                            if (cards[i].id === id) {
                                cards[i].inFavorites = true;
                            }
                        }
                    });
                }
                let data = {
                    cards: cards,
                    favoritesCnt: favoritesCnt,
                    layout: "catalog"
                }
                callback(data);
            });
    });
}
exports.postCatalog = (req, res, callback)=> {
    let cards = Array();

    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").find({}).limit(20);

    cardsCursor
        .forEach((card) => {
            cards.push(card);
        }).then(() => {
        profileCursor.then(profile => {
            if (profile != null)
                profile.favorites.forEach(id => {
                    for (let i = 0; i < cards.length; i++) {
                        if (cards[i].id === id) {
                            cards[i].inFavorites = true;
                        }
                    }
                })
            let data = {
                cards: cards
            }
            callback(data);
        })
    });
}
