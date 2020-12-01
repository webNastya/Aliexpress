const model = require('../model/catalog');
const compileFile = require("pug").compileFile;

exports.get = (req, res) => {
    model.get(req, res, (data)=>{
        res.send(compileFile('./view/index.pug')(data));
    })
}
exports.post = (req, res) => {
    model.post(req, res, (data)=>{
        res.send(compileFile('./Classes/Base/view/catalog.pug')(data));
    })
}