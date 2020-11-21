const Category = require('../models/category');
const pug = require("pug");

exports.getCategory = function (req, res) {
    Category.getCategory(req, res, (data)=>{
        res.send(pug.compileFile('./view/index.pug')(data));
    })
}
exports.postCategory = function (req, res) {
    Category.postCategory(req, res, (data)=>{
        res.send(pug.compileFile('./view/catalog.pug')(data));
    })
}
