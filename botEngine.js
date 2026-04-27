const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const fs = require("fs");

const bots = {};

async function createBot(userId, number, io) {

    const sessionPath = `./sessions/${userId}-${number}`;

    if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        printQRInTerminal: false
    });

    bots[number] = { sock, status: "connecting" };

    // 📲 Pairing code
    if (!sock.authState.creds.registered) {
        let code = await sock.requestPairingCode(number);

        io.emit("pairing", { number, code });

        bots[number].status = "pairing";
    }

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            bots[number].status = "online";

            io.emit("status", { number, status: "online" });
        }

        if (connection === "close") {
            bots[number].status = "offline";

            setTimeout(() => createBot(userId, number, io), 5000);
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

function getBot(number) {
    return bots[number] || { status: "not_found" };
}

module.exports = { createBot, getBot };
