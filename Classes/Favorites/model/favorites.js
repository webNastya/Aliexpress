const db = require('../../../db').get()
const ObjectId = require('mongodb').ObjectID

cardsOnPage = 20

exports.get = (req, res, callback)=>{
    let cards = Array()
    let favoritesCnt = 0

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
            },
            {
                "$project": {
                    "favoritesCardsLimit": {
                        "$slice": ["$favoritesCards", cardsOnPage]
                    },
                    "favorites": {
                        "from": "$favorites"
                    },
                    "basket": {
                        "from": "$basket"
                    }
                }
            }
        ]
    ).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            console.log(profile)
            favoritesCnt = profile.favorites.length;
            basketCnt = profile.basket.length;
            profile.favoritesCardsLimit.forEach((card)=>{
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
exports.post = (req, res, callback)=> {

    let cardsCnt = req.body.cardsCnt>0 ? req.body.cardsCnt : 0

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
            },
            {
                "$project": {
                    "favoritesCardsLimit": {
                        "$slice": ["$favoritesCards", cardsCnt, cardsCnt+cardsOnPage]
                    }
                }
            }
        ]
    ).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            profile.favoritesCardsLimit.forEach((card)=>{
                card.inFavorites = true;
                cards.push(card);
            })
        })
        let data = {
            cards: cards
        }
        callback(data);
    })
}
exports.add = (req, res, callback)=> {
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
exports.delete = (req, res, callback)=> {
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
