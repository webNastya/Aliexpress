const model = require('../model/similar'),
      compileFile = require("pug").compileFile

exports.post = (req, res) => {
    model.post(req, res, (data)=>{
        if(req.body.lastId)
            res.send(compileFile('./Classes/Base/view/similar.pug')(data))
        else
            res.send(compileFile('./Classes/Base/view/similarWrapper.pug')(data))
    })
}