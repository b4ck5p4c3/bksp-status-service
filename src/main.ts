import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "8010");
const NODERED_PUSH_TOKEN = process.env.NODERED_PUSH_TOKEN ?? "nodered-push-token";

const app = express();
app.use(bodyParser.json());

enum SpacePowerStatus {
    UNKNOWN = "unknown",
    ON = "on",
    OFF = "off"
}

const currentStatus = {
    spacePower: SpacePowerStatus.UNKNOWN
};

app.get("/status", (req, res) => {
    res.json(currentStatus);
});

app.use("/push/", (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).end();
        return;
    }
    const parts = req.headers.authorization.split(" ");
    if (parts.length != 2) {
        res.status(403).end();
        return;
    }
    if (parts[0] !== "Token" || parts[1] !== NODERED_PUSH_TOKEN) {
        res.status(403).end();
        return;
    }
    next();
})

app.post("/push/space-power", (req, res) => {
    switch (req.body.status) {
        case "on":
            currentStatus.spacePower = SpacePowerStatus.ON;
            break;
        case "off":
            currentStatus.spacePower = SpacePowerStatus.OFF;
            break;
    }
    res.end();
})

app.listen(PORT);
