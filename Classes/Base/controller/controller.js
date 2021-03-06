const compileFile = require("pug").compileFile;

module.exports = (model) => {
    exports.get = function (req, res) {
        model.get(req, res, (data) => {
            res.send(compileFile('./view/index.pug')(data));
        })
    }
    exports.post = function (req, res, path) {
        model.post(req, res, (data) => {
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
