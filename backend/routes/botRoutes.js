const { createBot, getBot } = require("../botEngine");
const { verifyToken } = require("../auth/jwt");

module.exports = (io) => {
    const router = require("express").Router();

    // 🚀 Create bot
    router.post("/create", verifyToken, async (req, res) => {
        const { number } = req.body;

        await createBot(req.user.id, number, io);

        res.json({
            success: true,
            message: "Bot starting..."
        });
    });

    // 📊 Status
    router.get("/status/:number", verifyToken, (req, res) => {
        res.json(getBot(req.params.number));
    });

    return router;
};
