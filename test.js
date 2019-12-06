const OJS = require("./index.js");
const Client = new OJS.Client({
    reconnect: true,
    controller: true
});

Client.on("join", () => {
    Client.chat.send("Hello, OWOP from OJS!");
})