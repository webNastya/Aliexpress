const controller = require('../controller/search')
let router = require('express').Router() // Создаем экземпляр класса Router для дальнейшего изменения
router = require('../../Base/router/router').Router(router, controller) // Расчиряем роутер до базовых обработчиков, определённых в контроллере

module.exports = router;
