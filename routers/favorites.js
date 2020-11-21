const router = require('express').Router();

router.get('/', (req, res) => {
    require('../controllers/favorites').getFavorites(req, res);
});
router.post('/', (req, res) => {
    require('../controllers/favorites').postFavorites(req, res);
});
router.post('/add', (req, res) => {
    require('../controllers/favorites').addFavorites(req, res);
});
router.post('/delete', (req, res) => {
    require('../controllers/favorites').deleteFavorites(req, res);
});

module.exports = router;
