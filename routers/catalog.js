const router = require('express').Router();

router.get('/', (req, res) => {
    require('../controllers/catalog').getCatalog(req, res);
});
router.post('/', (req, res) => {
    require('../controllers/catalog').postCatalog(req, res);
});

module.exports = router;
