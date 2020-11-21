const router = require('express').Router();

router.get('/', (req, res) => {
    require('../controllers/category').getCategory(req, res);
});
router.post('/', (req, res) => {
    require('../controllers/category').postCategory(req, res);
});

module.exports = router;
