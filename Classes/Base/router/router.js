exports.Router = (router, controller) => {
    router.get('/', (req, res) => {
        controller.get(req, res);
    });
    router.post('/', (req, res) => {
        console.log(controller, "controller in base router")
        controller.post(req, res);
    });
    return router;
}