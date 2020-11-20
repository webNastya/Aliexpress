const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const pug = require('pug');
const mongoClient = new MongoClient("mongodb+srv://root:hoRYEGRpiQFNH46u@cluster0.cfp4c.mongodb.net/");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/src', express.static('public'));
app.use(session({
    store: new FileStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000} // 1 week
}));


const PORT = process.env.PORT || 3001;

mongoClient.connect((err, client)=> {
    const db = client.db("Aliexpress");

    app.use(function (req, res, next) {
        const db = client.db("Aliexpress");
        if(!req.session.token){
            const collectionProfile = db.collection("profiles");
            collectionProfile
                .insertOne({favorites: [], basket: []},
                    function(err, profile){
                        req.session.token = profile.insertedId;
                        req.session.save(() => {
                            console.log("new session");
                        });
                    });
        }
        next()
    })
    app.get('/', (req, res) => {
        if (err)
            console.log(err)

        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").find({}).limit(20);
        let cards = Array();
        let favoritesCnt = 0;

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
                    });
                }
                const compiledFunction = pug.compileFile('./view/index.pug');
                res.send(compiledFunction({
                    cards: cards,
                    favoritesCnt: favoritesCnt,
                    layout: "catalog"
                }));
            });
        });
    });
    
    app.post('/', (req, res) => {
        if (err)
            console.log(err);

        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").find({}).limit(20);
        let cards = Array();

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
                    const compiledFunction = pug.compileFile('./view/catalog.pug');
                    res.send(compiledFunction({
                        cards: cards
                    }));
                })
            });
    });

    app.get('/card', (req, res) => {
        if (err)
            console.log(err);

        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").findOne({id: req.query.id});
        let favoritesCnt = 0;

        cardsCursor.then((card)=>{
            profileCursor.then(profile => {
                if (profile != null) {
                    favoritesCnt = profile.favorites.length;
                    card.inFavorites = profile.favorites.includes(card.id);
                }
                const compiledFunction = pug.compileFile('./view/index.pug');
                res.send(compiledFunction({
                    card: card,
                    favoritesCnt: favoritesCnt,
                    layout: "card"
                }));
            });
        });
    });
    app.post('/card', (req, res) => {
        if (err)
            console.log(err);

        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").findOne({id: req.body.id});

        cardsCursor.then((card)=>{
            profileCursor.then(profile => {
                if (profile != null)
                    card.inFavorites = profile.favorites.includes(card.id);
                const compiledFunction = pug.compileFile('./view/card.pug');
                res.send(compiledFunction({
                    card: card
                }));
            });
        });
    });
    app.get('/category', (req, res) => {
        if (err)
            console.log(err);

        let category = req.query.cat;
        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").find({category: category}).limit(20);
        let cards = Array();
        let favoritesCnt = 0;

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
                const compiledFunction = pug.compileFile('./view/index.pug');
                res.send(compiledFunction({
                    cards: cards,
                    favoritesCnt: favoritesCnt,
                    layout: "catalog"
                }));
            });
        });
    });
    app.post('/category', (req, res) => {
        if (err)
            console.log(err);

        let category = req.body.category;
        const profileCursor = db.collection("profiles").findOne({_id: ObjectId(req.session.token)});
        const cardsCursor = db.collection("cards").find({category: category}).limit(20);
        let cards = Array();

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
                const compiledFunction = pug.compileFile('./view/catalog.pug');
                res.send(compiledFunction({
                    cards: cards
                }));
            });
        });
    });
    app.get('/favorites', (req, res) => {
        if (err)
            console.log(err)

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
        ).limit(20).toArray().then(data=>{
            data.forEach(profile=>{
                favoritesCnt = profile.favorites.length;
                profile.favoritesCards.forEach((card)=>{
                    card.inFavorites = true;
                    cards.push(card);
                });
            })
            const compiledFunction = pug.compileFile('./view/index.pug');
            res.send(compiledFunction({
                cards: cards,
                favoritesCnt: favoritesCnt,
                layout: "catalog"
            }));
        })
    });
    app.post('/favorites', (req, res) => {
        if (err)
            console.log(err)

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
        ).limit(20).toArray().then(data=>{
            data.forEach(profile=>{
                profile.favoritesCards.forEach((card)=>{
                    card.inFavorites = true;
                    cards.push(card);
                });
            })
            const compiledFunction = pug.compileFile('./view/catalog.pug');
            res.send(compiledFunction({
                cards: cards
            }));
        })
    });
    app.post('/favorites/add', (req, res) => {
        if (err)
            console.log(err);

        const profiles = db.collection("profiles");
        profiles
            .updateOne(
                {_id: ObjectId(req.session.token)},
                {$addToSet: { favorites: req.body.card.id}}
            )
            .then(()=>{
                res.send("true");
            });
    });
    app.post('/favorites/delete', (req, res) => {
        if (err)
            console.log(err);

        const profiles = db.collection("profiles");
        profiles
            .updateOne(
                {_id: ObjectId(req.session.token)},
                {$pull: { favorites: req.body.card.id}}
            )
            .then(()=>{
                res.send("false");
            });
    });
    app.listen(PORT, () => {
    });
});