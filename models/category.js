const db = require('../db').get();
const ObjectId = require('mongodb').ObjectID;

exports.getCategory = (req, res, callback)=>{
    let cards = Array();
    let favoritesCnt = 0;
    let category = req.query.cat;

    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").find({category: category}).limit(20);

    cardsCursor
        .forEach((card)=>{
            cards.push(card);
        }).then(()=>{
        profileCursor.then(profile => {
            if (profile != null) {
                favoritesCnt = profile.favorites.length;
                profile.favorites.forEach(id => {
                    for (let i = 0; i < cards.length; i++) {
                        if (cards[i].id === id) {
                            cards[i].inFavorites = true;
                        }
                    }
                })
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
exports.postCategory = (req, res, callback)=> {
    let cards = Array();
    let category = req.body.category;

    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").find({category: category}).limit(20);

    cardsCursor
        .forEach((card)=>{
            cards.push(card);
        }).then(()=>{
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
        });
    });
}
