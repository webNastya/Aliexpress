const model = require('../model/basket');
const path = require("path");
const compileFile = require("pug").compileFile;

exports.get = (req, res) => {
    model.get(req, res, (data)=>{
        res.send(compileFile('./view/index.pug')(data));
    })
}
exports.post = (req, res) => {
    model.post(req, res, (data)=>{
        res.send(compileFile(path.join(__dirname, "../view/basket.pug"))(data));
    })
}
exports.delete = (req, res) => {
    model.delete(req, res, ()=>{
        res.send("false");
    })
}
exports.add = (req, res) => {
    model.add(req, res, ()=>{
        res.send("true");
    })
}
exports.addOne = function (req, res) {
    model.addOne(req, res, ()=>{
        res.send("true");
    })
}
exports.deleteOne = function (req, res) {
    model.deleteOne(req, res, ()=>{
        res.send("true");
    })
}
