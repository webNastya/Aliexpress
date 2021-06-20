const db = require('../../../db').get();
const ObjectId = require('mongodb').ObjectID;

cardsSearchOnPage = 10;

exports.get = (req, res, callback)=>{
    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    const cardsCursor = db.collection("cards").findOne({id: req.query.id});
    let favoritesCnt = 0;
    let basketCnt = 0;

    cardsCursor.then((card)=>{
        profileCursor.then(profile => {
            if (profile != null) {
                favoritesCnt = profile.favorites.length;
                basketCnt = profile.basket.length;
                card.inFavorites = profile.favorites.includes(card.id);
                profile.basket.forEach((c)=>
                {
                    if(c.id === card.id)
                        card.inBasket = true
                })
            }
            let data = {
                card: card,
                favoritesCnt: favoritesCnt,
                basketCnt: basketCnt,
                layout: "card",
                moment : require('moment')
            };
            callback(data);
        });
    });
}
exports.post = (req, res, callback)=> {
    let cards = Array()

    let query = req.body.query;
    let cardsCursor = db.collection("cards")

    cardsCursor = cardsCursor.aggregate([
        { $match:
                {title: {$regex: query, $options: 'i'}},
        },
        {$sample: {size: cardsSearchOnPage}}
    ])

    cardsCursor
        .forEach((card) => {
            cards.push(card);
        })
        .then(() => {
            let data = {
                cards: cards
            }
            callback(data);
        })
}
