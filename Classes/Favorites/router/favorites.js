const controller = require('../controller/favorites');
let router = require('express').Router();
router = require('../../Base/router/router').Router(router, controller);

router.post('/add', (req, res) => {
    controller.add(req, res);
});
router.post('/delete', (req, res) => {
    controller.delete(req, res);
});

module.exports = router;
