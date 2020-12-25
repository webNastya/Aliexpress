const model = require('../model/auth')
const path = require("path")
const compileFile = require("pug").compileFile

exports.get = (req, res) => {
    // model.get(req, res, (data)=>{
        res.send(compileFile(path.join(__dirname, '../view/auth.pug'))())
    // })
}
exports.post = (req, res) => {
    // model.post(req, res, (data)=>{
        res.send(compileFile(path.join(__dirname, "../view/auth.pug"))())
    // })
}

exports.register = (req, res) => {
        model.register(req, res, (data)=>{
                res.send(compileFile(path.join(__dirname, "../view/auth.pug"))(data))
        })

}

exports.login = (req, res) => {
        passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/auth",
                failureFlash: true,
        })(req, res, next);
}