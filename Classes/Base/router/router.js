exports.Router = (router, controller) => {
    router.get('/', (req, res) => {
        controller.get(req, res);
    });
    router.post('/', (req, res) => {
        controller.post(req, res);
    });
    return router;
}