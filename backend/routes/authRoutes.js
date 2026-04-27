const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken } = require("../auth/jwt");

const router = express.Router();

// 🧑 Register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hash });

    res.json({ success: true, user });
});

// 🔐 Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Wrong password" });

    const token = signToken({ id: user._id, email });

    res.json({ success: true, token });
});

module.exports = router;
