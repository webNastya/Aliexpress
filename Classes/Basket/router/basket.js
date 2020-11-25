const controller = require('../controller/basket');
let router = require('express').Router();
router = require('../../Base/router/router').Router(router, controller);

router.post('/add', (req, res) => {
    controller.add(req, res);
});
router.post('/delete', (req, res) => {
    controller.delete(req, res);
});
router.post('/add/one', (req, res) => {
    controller.addOne(req, res);
});
router.post('/delete/one', (req, res) => {
    controller.deleteOne(req, res);
});

module.exports = router;
