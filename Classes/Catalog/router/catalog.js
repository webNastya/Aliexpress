const controller = require('../controller/catalog');
console.log(controller, "Controller in router")
let router = require('express').Router();
router = require('../../Base/router/router').Router(router, controller);

module.exports = router;
