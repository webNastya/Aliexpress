const Favorites = require('../models/favorites');
const pug = require("pug");

exports.getFavorites = function (req, res) {
    Favorites.getFavorites(req, res, (data)=>{
        res.send(pug.compileFile('./view/index.pug')(data));
    })
}
exports.postFavorites = function (req, res) {
    Favorites.postFavorites(req, res, (data)=>{
        res.send(pug.compileFile('./view/catalog.pug')(data));
    })
}
exports.deleteFavorites = function (req, res) {
    Favorites.deleteFavorites(req, res, ()=>{
        res.send("false");
    })
}
exports.addFavorites = function (req, res) {
    Favorites.addFavorites(req, res, ()=>{
        res.send("true");
    })
}
