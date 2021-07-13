const db = require('../../../db').get();
const ObjectId = require('mongodb').ObjectID;

cardsInSample = 8;

exports.post = (req, res, callback)=> {
    let cards = Array();
    let category = req.body.category;
    let availableCards = req.body.availableCards

    const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
    let cardsCursor = db.collection("cards")

    cardsCursor = cardsCursor.aggregate([
        { $match: {
                "category": category,
                "id": {$nin: availableCards ? availableCards : []}
            }
        },
        {$sample: {size: cardsInSample}}
    ])

    cardsCursor
        .forEach((card)=>{
            cards.push(card);
        }).then(()=>{
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
                let data = cards
                callback(data);
            });
        });
}
