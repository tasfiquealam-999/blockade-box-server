# Blockade Board multiplayer server

## Files
- `server.js` — room creation/joining, waiting-room seats, match start, game event relay, chat relay, health endpoint.
- `package.json` — Node.js dependencies and start command.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Check `http://localhost:3000/health`.

## Deploy (Render or similar)
- Create a **Web Service** from the repository containing these files.
- Runtime: Node.
- Build command: `npm install`
- Start command: `npm start`
- Set `CORS_ORIGIN` to the exact origin(s) serving the game, comma-separated, or leave unset for `*`.
- The service must allow WebSocket connections.

## Important client setting
The supplied HTML currently connects to:
`https://blockade-box-server.onrender.com`

After deploying this server, change `NET.url` in the HTML to your new service URL, unless you deploy this code to that exact existing service.

## Compatibility notes
The server follows the event names used by the uploaded client: `create`, `join`, `quick`, `room`, `start`, `seat`, `m`, `peer-left`, and `chat`. It relays gameplay actions; the browser client remains responsible for applying game rules. Run two browsers/devices through create/join, test chat in the waiting room and during a match, then test each game mode before publishing.
