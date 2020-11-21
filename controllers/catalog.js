const Catalog = require('../models/catalog');
const pug = require("pug");

exports.getCatalog = function (req, res) {
    Catalog.getCatalog(req, res, (data)=>{
        res.send(pug.compileFile('./view/index.pug')(data));
    })
}
exports.postCatalog = function (req, res) {
    Catalog.postCatalog(req, res, (data)=>{
        res.send(pug.compileFile('./view/catalog.pug')(data));
    })
}
