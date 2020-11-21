const Basket = require('../models/basket');
const pug = require("pug");

exports.getBasket = function (req, res) {
    Basket.getBasket(req, res, (data)=>{
        res.send(pug.compileFile('./view/index.pug')(data));
    })
}
exports.postBasket = function (req, res) {
    Basket.postBasket(req, res, (data)=>{
        res.send(pug.compileFile('./view/basket.pug')(data));
    })
}
exports.addBasket = function (req, res) {
    Basket.addBasket(req, res, ()=>{
        res.send("true");
    })
}
exports.deleteBasket = function (req, res) {
    Basket.deleteBasket(req, res, ()=>{
        res.send("true");
    })
}

