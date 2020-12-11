const model = require('../model/card');
const path = require("path");

baseController = require("../../Base/controller/controller")(model);
exports.post   = (req, res) => baseController.post(req, res, path.join(__dirname, "../view/card.pug"));
exports.get    = baseController.get;