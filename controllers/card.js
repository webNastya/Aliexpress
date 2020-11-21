const Catalog = require('../models/card');
const pug = require("pug");

exports.getCard = function (req, res) {
    Catalog.getCard(req, res, (data)=>{
        res.send(pug.compileFile('./view/index.pug')(data));
    })
}
exports.postCard = function (req, res) {
    Catalog.postCard(req, res, (data)=>{
        res.send(pug.compileFile('./view/card.pug')(data));
    })
}
