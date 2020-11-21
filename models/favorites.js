const db = require('../db').get();
const ObjectId = require('mongodb').ObjectID;

exports.getFavorites = (req, res, callback)=>{
    let cards = Array();
    let favoritesCnt = 0;

    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "favorites",
                        foreignField: "id",
                        as: "favoritesCards"
                    }
            }
        ]
    ).limit(20).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            favoritesCnt = profile.favorites.length;
            basketCnt = profile.basket.length;
            profile.favoritesCards.forEach((card)=>{
                card.inFavorites = true;
                cards.push(card);
            });
        })
        let data = {
            cards: cards,
            favoritesCnt: favoritesCnt,
            basketCnt: basketCnt,
            layout: "catalog"
        }
        callback(data);
    })
}
exports.postFavorites = (req, res, callback)=> {
    let cards = Array();
    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "favorites",
                        foreignField: "id",
                        as: "favoritesCards"
                    }
            }
        ]
    ).limit(20).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            profile.favoritesCards.forEach((card)=>{
                card.inFavorites = true;
                cards.push(card);
            });
        })
        let data = {
            cards: cards
        }
        callback(data);
    })
}
exports.addFavorites = (req, res, callback)=> {
    const profiles = db.collection("profiles");
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$addToSet: {favorites: req.body.card.id}}
        )
        .then(() => {
            callback();
        });
}
exports.deleteFavorites = (req, res, callback)=> {
    const profiles = db.collection("profiles");
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$pull: {favorites: req.body.card.id}}
        )
        .then(() => {
            callback();
        });
}
