const controller = require('../controller/auth');
let router = require('express').Router();
router = require('../../Base/router/router').Router(router, controller);

router.post('/register', (req, res) => {
    controller.register(req, res);
});
router.post('/auth', (req, res) => {
    controller.login(req, res);
});

module.exports = router;
