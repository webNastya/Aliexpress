const controller = require("../controller/auth");
let router = require("express").Router();
router = require("../../Base/router/router").Router(router, controller);

router.post("/signup", (req, res) => {
  controller.signup(req, res);
});
router.post("/login", (req, res, next) => {
  controller.login(req, res, next);
});

module.exports = router;
