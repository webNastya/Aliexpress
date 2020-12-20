const model = require('../model/category'),
      compileFile = require("pug").compileFile

exports.get = (req, res) => {
    res.cookie("currState", "category")
    model.get(req, res, (data)=>{
        res.send(compileFile('./view/index.pug')(data))
    })
}
exports.post = (req, res) => {
    res.cookie("currState", "category")
    model.post(req, res, (data)=>{
        if(req.body.lastId)
            res.send(compileFile('./Classes/Base/view/catalog.pug')(data))
        else
            res.send(compileFile('./Classes/Base/view/catalogWrapper.pug')(data))
    })
}