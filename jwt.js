const jwt = require("jsonwebtoken");

const SECRET = "WA_SAAS_SECRET";

function signToken(user) {
    return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "No token" });

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = { signToken, verifyToken };
