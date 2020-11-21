const db = require('../db').get();
const ObjectId = require('mongodb').ObjectID;

exports.getBasket = (req, res, callback)=>{
    let cards = Array();
    let basketCnt = 0;
    let favoritesCnt = 0;

    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "basket",
                        foreignField: "id",
                        as: "basketCards"
                    }
            }
        ]
    ).limit(20).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            basketCnt = profile.basket.length;
            profile.basketCards.forEach((card)=>{
                card.inBasket = true;
                cards.push(card);
            });
            favoritesCnt = profile.favorites.length;
            profile.favorites.forEach(id => {
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].id === id) {
                        cards[i].inFavorites = true;
                    }
                }
            });
        })
        let data = {
            cards: cards,
            favoritesCnt: favoritesCnt,
            basketCnt: basketCnt,
            layout: "basket"
        }
        callback(data);
    })
}
exports.postBasket = (req, res, callback)=> {
    let cards = Array();

    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "basket",
                        foreignField: "id",
                        as: "basketCards"
                    }
            }
        ]
    ).limit(20).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            profile.basketCards.forEach((card)=>{
                card.inBasket = true;
                cards.push(card);
            });
            profile.favorites.forEach(id => {
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].id === id) {
                        cards[i].inFavorites = true;
                    }
                }
            })
        })
        let data = {
            cards: cards
        }
        callback(data);
    })
}
exports.addBasket = (req, res, callback)=> {
    const profiles = db.collection("profiles");
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$addToSet: {basket: req.body.card.id}}
        )
        .then(() => {
            callback();
        });
}
exports.deleteBasket = (req, res, callback)=> {
    const profiles = db.collection("profiles");
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$pull: {basket: req.body.card.id}}
        )
        .then(() => {
            callback();
        });
}
