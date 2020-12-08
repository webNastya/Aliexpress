const controller = require('../controller/catalog');
let router = require('express').Router();
router = require('../../Base/router/router').Router(router, controller);

module.exports = router;
