const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mongoUtil = require( './mongoUtil' );
const app = express();

// Парсер URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Доступ к файлам стилей, шрифтов и т.п.
app.use('/src', express.static('public'));

const PORT = process.env.PORT || 3001;

// Настройка сессий
app.use(session({
    store: new FileStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000} // 1 week
}));

// Соединение с базой
mongoUtil.connect( function( err, client ) {
    if (err) console.log(err);

    // Обработка сессий
    app.use((req, res, next)=>{
        const db = require('./mongoUtil').db();
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
    // Роутинг страниц
    const catalog = require('./routers/catalog');
    const card = require('./routers/card');
    const category = require('./routers/category');
    const favorites = require('./routers/favorites');
    app.use('/', catalog);
    app.use('/card', card);
    app.use('/category', category);
    app.use('/favorites', favorites);

    // Запуск сервера
    app.listen(PORT, () => {
    });
});
