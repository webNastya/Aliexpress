const compileFile = require("pug").compileFile;

module.exports = (model) => {
    console.log(model, " base controller")
    exports.get = function (req, res) {
        model.get(req, res, (data) => {
            res.send(compileFile('./view/index.pug')(data));
        })
    }
    exports.post = function (req, res, path) {
        console.log(model, " model in post base controller")
        model.post(req, res, (data) => {
            console.log(path)
            console.log(data)
            res.send(compileFile(path)(data));
        })
    }
    exports.add = function (req, res) {
        model.add(req, res, () => {
            res.send("true");
        })
    }
    exports.delete = function (req, res) {
        model.delete(req, res, () => {
            res.send("true");
        })
    }
    return exports;
}
