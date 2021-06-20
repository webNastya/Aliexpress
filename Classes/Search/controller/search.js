const model = require('../model/search')
const path = require("path")
const compileFile = require("pug").compileFile

exports.post = (req, res) => {
    model.post(req, res, (data) => {
        console.log("dirname", path.join(__dirname, "../view/search.pug"))
        res.send(compileFile(path.join(__dirname, "../view/search.pug"))(data));
    })
}

exports.get = (req, res) => {
    // res.cookie("currState", "favorites")
    // model.get(req, res, (data)=>{
    //     res.send(compileFile('./view/index.pug')(data));
    // })
    res.status(404).send('Not found')
}