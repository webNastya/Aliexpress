const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      FileStore = require('session-file-store')(session),
      passport = require("passport"),
      DB = require( './db' ),
      cookieParser = require('cookie-parser'),
      app = express()
require("dotenv").config()

// Модуль cookie
app.use(cookieParser('secret key'))

// Модуль для текущей даты
app.locals.moment = require('moment');

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
}))

app.use(passport.initialize())
app.use(passport.session())

// Соединение с базой
DB.connect( function( err, client ) {
    if (err) console.log(err);

    // Обработка сессий
    app.use((req, res, next)=>{
        if(!req.session.token){
            const db = require('./db').get();
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
    //passport config
    require("./config/passport")(passport)

    // Роутинг страниц
    const basket = require('./Classes/Basket/router/basket'),
          catalog = require('./Classes/Catalog/router/catalog'),
          card = require('./Classes/Card/router/card'),
          auth = require('./Classes/Auth/router/auth'),
          category = require('./Classes/Category/router/category'),
          favorites = require('./Classes/Favorites/router/favorites'),
          search = require('./Classes/Search/router/search'),
          similar = require('./Classes/Similar/router/similar')
    app.use('/', catalog);
    app.use('/auth', auth);
    app.use('/card', card);
    app.use('/category', category);
    app.use('/favorites', favorites);
    app.use('/basket', basket);
    app.use('/search', search);
    app.use('/similar', similar);

    // Запуск сервера
    app.listen(PORT, () => {
        console.log("server started");
    });
});
