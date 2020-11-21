const router = require('express').Router();

router.get('/', (req, res) => {
    require('../controllers/basket').getBasket(req, res);
});
router.post('/', (req, res) => {
    require('../controllers/basket').postBasket(req, res);
});
router.post('/add', (req, res) => {
    require('../controllers/basket').addBasket(req, res);
});
router.post('/delete', (req, res) => {
    require('../controllers/basket').deleteBasket(req, res);
});

module.exports = router;
