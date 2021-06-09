const db = require('../../../db').get()
const ObjectId = require('mongodb').ObjectID

cardsOnPage = 18

exports.get = (req, res, callback)=>{
    let cards = Array()
    let favoritesCnt = 0
    let basketCnt = 0

    let lastId = req.query.lastId
    let availableCards = req.body.availableCards
    let profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)})
    let cardsCursor = db.collection("cards")

    cardsCursor = cardsCursor.aggregate([
        { $match: {
                "id": {$nin: availableCards ? availableCards : []}
            }
        },
        {$sample: {size: cardsOnPage}}
    ])
    cardsCursor
        .forEach((card) => {
            cards.push(card)
        })
        .then(() => {
            profileCursor.then(profile => {
                if (profile != null) {
                    basketCnt = profile.basket.length
                    favoritesCnt = profile.favorites.length
                    profile.favorites.forEach(id => {
                        for (let i = 0; i < cards.length; i++) {
                            if (cards[i].id === id) {
                                cards[i].inFavorites = true
                            }
                        }
                    });
                    profile.basket.forEach((cardData)=>
                    {
                        for (let i = 0; i < cards.length; i++) {
                            if (cards[i].id === cardData.id) {
                                cards[i].inBasket = true;
                            }
                        }
                    });
                }
                let data = {
                    cards: cards,
                    favoritesCnt: favoritesCnt,
                    basketCnt: basketCnt,
                    layout: "catalog"
                }
                callback(data);
            })
    })
}
exports.post = (req, res, callback)=> {
    let cards = Array();

    let lastId = req.body.lastId
    let availableCards = req.body.availableCards
    let profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    let cardsCursor = db.collection("cards")

    console.log("post catalog")

    cardsCursor = cardsCursor.aggregate([
        { $match: {
                "id": {$nin: availableCards ? availableCards : []}
            }
        },
        {$sample: {size: cardsOnPage}}
    ])

    cardsCursor
        .forEach((card) => {
            cards.push(card);
        })
        .then(() => {
        profileCursor.then(profile => {
            if (profile != null) {
                profile.favorites.forEach(id => {
                    for (let i = 0; i < cards.length; i++) {
                        if (cards[i].id === id) {
                            cards[i].inFavorites = true;
                        }
                    }
                })
                profile.basket.forEach((cardData) => {
                    for (let i = 0; i < cards.length; i++) {
                        if (cards[i].id === cardData.id) {
                            cards[i].inBasket = true;
                        }
                    }
                });
            }
            let data = {
                cards: cards
            }
            callback(data);
        })
    });
}
