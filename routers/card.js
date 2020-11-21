const router = require('express').Router();

router.get('/', (req, res) => {
    require('../controllers/card').getCard(req, res);
});
router.post('/', (req, res) => {
    require('../controllers/card').postCard(req, res);
});

module.exports = router;
