const db = require('../db').get();
const ObjectId = require('mongodb').ObjectID;
const profiles = db.collection("profiles");

exports.getBasket = (req, res, callback)=>{
    let cards = Array();
    let basketCnt = 0;
    let favoritesCnt = 0;
    let basketTotal = 0;

    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "basket.id",
                        foreignField: "id",
                        as: "basketCards"
                    }
            }
        ]
    ).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            basketCnt = profile.basket.length;
            profile.basketCards.forEach((card)=>{
                card.inBasket = true;
                cards.push(card);
            });
            profile.basket.forEach((cardData)=>
            {
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].id === cardData.id) {
                        cards[i].cnt = cardData.cnt;
                        basketTotal += cards[i].cnt * cards[i].price;
                    }
                }
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
            basketTotal: basketTotal,
            layout: "basket"
        }
        callback(data);
    })
}
exports.postBasket = (req, res, callback)=> {
    let cards = Array();
    let basketCnt = 0;
    let basketTotal = 0;

    db.collection("profiles").aggregate(
        [
            {$match: {_id: ObjectId(req.session.token)}},
            {
                $lookup:
                    {
                        from: "cards",
                        localField: "basket.id",
                        foreignField: "id",
                        as: "basketCards"
                    }
            }
        ]
    ).toArray().then(profiles=>{
        profiles.forEach(profile=>{
            basketCnt = profile.basket.length;
            profile.basketCards.forEach((card)=>{
                card.inBasket = true;
                cards.push(card);
            });
            profile.basket.forEach((cardData)=>
            {
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].id === cardData.id) {
                        cards[i].cnt = cardData.cnt;
                        basketTotal += cards[i].cnt * cards[i].price;
                    }
                }
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
            cards: cards,
            basketCnt: basketCnt,
            basketTotal: basketTotal,
        }
        callback(data);
    })
}
exports.addBasket = (req, res, callback)=> {
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$addToSet: {basket: {id: req.body.card.id, cnt: 1}}}
        )
        .then(() => {
            callback();
        });
}
exports.deleteBasket = (req, res, callback)=> {
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token)},
            {$pull: {basket: {id: req.body.card.id}}}
        )
        .then(() => {
            callback();
        });
}
exports.addOneToBasket = (req, res, callback)=> {
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token), "basket.id": req.body.card.id},
            {$inc: {"basket.$.cnt": 1}}
        )
        .then(() => {
            callback();
        });
}
exports.deleteOneInBasket = (req, res, callback)=> {
    profiles
        .updateOne(
            {_id: ObjectId(req.session.token), "basket.id": req.body.card.id},
            {$inc: {"basket.$.cnt": -1}}
        )
        .then(() => {
            callback();
        });
}

