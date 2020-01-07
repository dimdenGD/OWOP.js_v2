# OWOP.js / OJS - v2
Node.js library for [OWOP](https://ourworldofpixels.com "OWOP"). Support Discord server - [discord.gg/k4u7ddk](https://discord.gg/k4u7ddk "discord.gg/k4u7ddk").

Installing: `npm i owop-js`.\
**REQUIRES NODE.JS 12.0+!**

![Nodejs](https://img.shields.io/badge/-Node.js%2012.0%2B-brightgreen?style=for-the-badge&logo=node.js&labelColor=1a1a1a)

This is quite new package, so if you'll find any bugs, don't forget that you can contribute too! I'm often busy, so usually I'm not able to update anything quickly.

*You can also use browser version in [OPM](https://opm.glitch.me "OPM"). In OPM version there is `simpleChunks` option for using OWOP internal chunks, `renderCaptcha` for captcha rendering, and there is no `agent`, `origin`, `controller`, and other node.js only options.*

#### OPM Example
```js
const OJS = OPM.require("owop-js");
const Client = new OJS.Client({
    reconnect: true
});

Client.on("join", () => {
    Client.chat.send("Hello from browser OJS!");
});
```

# Node.js Example
```js
const OJS = require("owop-js");
const Client = new OJS.Client({
    reconnect: true,
    controller: true
});

Client.on("join", () => {
    Client.chat.send("Hello, OWOP from OJS!");
});
```

# Events
`open` - Opened WebSocket connection.\
`close` - Closed WebSocket connection.\
`join` - Joined to world [world name].\
`id` - Got id [id].\
`rawMessage` - Any message from WebSocket server. (It can be object or string) [data].\
`update` - Player in world updates [player object].\
`pixel` - New pixel in world [x, y, [r, g, b]].\
`disconnect` - Someone in world disconnected [player object].\
`connect` - Someone in world connected [id].\
`teleport` - got 'teleport' opcode. Very rare. [x, y].\
`rank` - Got new rank. [rank].\
`captcha` - Captcha state. [gcaptcha id].\
`chunkProtect` - Chunk (un)protected. [x, y, newState].\
`pquota` - New PQuota. [rate, per].\
`destroy` - Socket was destroyed and won't reconnect anymore.\
`chunk` - New chunk. [x, y, chunk, protected].\
`message` - New message in chat. [msg].

# Options
`ws` - Websocket server address. (default - `wss://ourworldofpixels.com`)\
`origin` - Origin header (default - `https://ourworldofpixels.com`).\
`id` - ID for logging. If not set, OWOP ID will be used.\
`agent` - Proxy Agent.\
`world` -  World name. (default - `main`).\
`noLog` - No logging.\
`reconnect` - Reconnect if disconnected.\
`adminlogin` -  Admin login.\
`modlogin` - Mod login.\
`pass` -  Pass for world.\
`captchapass` -  Captcha pass.\
`teleport` -  Teleport on 'teleport' opcode.\
`controller` - Enable controller for this bot. (Use only once!).\
`reconnectTime` - Reconnect time (ms) after disconnect (default - 5000).\
`unsafe` - Use methods that are supposed to be only for admin or moderator.

# Module
When you require lib, you get object with:

`Client` - main OJS Client class (requires `options` object).\
`Bucket` - Bucket class for quota.\
`ChunkSystem` - Class for chunks, pixels management.\
`Chunks` - instance of `ChunkSystem`, all bots that will request chunks will give chunk info to this instance.

# API

## Client
Client API is similar to OWOP, and some methods have same 'path'.
### <\static>Client.RANK
Object with all ranks - `ADMIN`, `MODERATOR`, `USER` and `NONE`.
### <\static> Client.options
Object with OWOP options. Check code to see them.
### Client.clientOptions
Options that you passed in `options` argument.
### Client.chat
#### Client.chat.send(msg)
Send message in chat.
#### Client.chat.local(msg)
Local message in console.
#### Client.chat.sendModifier
Function for modifying and getting messages that you gonna send.
#### Client.chat.recvModifier
Function for modifying and getting messages that you're getting from server.
#### Client.chat.messages
All messages that you got. Keep in mind that it can only hold maximum of `Client.options.maxChatBuffer` messages in it (default - 256).

### Client.world
#### Client.world.join(name)
Function to join world. Should not be used, only for internal use! For connections to new worlds you should use new `Client` with `world` option in it.
#### Client.world.leave()
Leave world. If there's `reconnect` option enabled, client will try to reconnect after `options.reconnectTime` (default - 5000ms) seconds.
#### Client.world.destroy()
Leave world and don't reconnect anymore.
#### Client.world.move(x = 0, y = 0)
Move bot to X, Y.
#### Client.world.setPixel(x = player.x, y = player.y, color = player.color, sneaky)
Move and set pixel. If `sneaky` option is set to true, bot will return to old location.
#### Client.world.setTool(id = 0)
Set tool that bot has eqquiped.
#### Client.world.setColor(color = [0, 0, 0])
Set color of bot.
#### Client.world.protectChunk(x = player.x, y = player.y, newState = 1)
Protect chunk. You need to be admin to use this but you can ignore this if you'll use `unsafe` option. 
#### Client.world.clearChunk(x = player.x, y = player.y, rgb = player.color)
Clear chunk. You need to be admin to use this but you can ignore this if you'll use `unsafe` option. 
#### await Client.world.requestChunk(x = player.x, y = player.y, innacurate)
Request chunk, it'll be loaded to `ChunkSystem`. If `inaccurate` argument is passed, it'll transform `x` and `y` to `chunkX` and `chunkY`, so you can use normal coords to request chunks. Returns raw chunk.
```js
if(inaccurate) {
	x = Math.floor(x/OJS.options.chunkSize);
	y = Math.floor(y/OJS.options.chunkSize);
};
```
#### await Client.world.getPixel(x = player.x, y = player.y)
Request chunk and get pixel.

### Client.player
- Client.player.x
- Client.player.y
- Client.player.worldX - x\*16
- Client.player.worldY - y\*16
- Client.player.tool
- Client.player.rank
- Client.player.id
- Client.player.color

### Client.players
List of players. Every player is object with properties:
- x
- y
- id
- color
- tool

Example: `Client.players[15035]`.

### Client.net
- **Client.net.isWebsocketConnected** - is connected to server.
- **Client.net.isWorldConnected** - is connected to world.
- **Client.net.destroyed** - is `Client` destroyed.
- **Client.net.bucket** - instance of `Bucket` for PQuota.
- **Client.net.dataHandler** - data handler, I don't think you'll ever need to change something here.
- **Client.net.messageHandler** - message handler.

### Client.util
- **Client.util.log** - console log with `Client.player.id` or `option.id` if `option.noLog` is enabled.
- **Client.util.decompress** - Chunk decompressor. Vars :(

Client also has primitive EventEmitter - `on`, `once`, `emit`, `off`.

## ChunkSystem
This class is created just for **`Chunks`**, I don't think you'll ever need to use it.

## Chunks
All chunks and pixels stuff goes here.
- **Chunks.chunks** - array with chunks. In this array chunks are saved like this: `Chunks.chunks[x][y]`.
- **Chunks.chunkProtected** - same thing as `chunks` but only for protected chunks.

Keep in mind, that you'll usually only need `Chunks.getPixel` from all this stuff here. 

### Chunks.setChunk(x, y, data)
Set chunk data.

### Chunks.getChunk(x, y, raw)
Get chunk data. Usually it tries to get chunks by normal coords, but if you'll set `raw` arg, you can use your own chunk coords.

### Chunks.removeChunk(x, y)
Remove chunk.

### Chunks.setPixel(x, y, rgb)
Set pixel in chunk.

### **Chunk.getPixel(x, y)**
Get pixel from chunk.

### Chunk.protectChunk(x, y)
Protect chunk.

### Chunk.unProtectChunk(x, y)
Unprotect chunk.

### Chunk.isProtected(x, y)
Is chunk protected.

# License & Author

License - MIT.\
Created by [dimden](https://dimden.dev/). 
