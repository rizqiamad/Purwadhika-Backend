"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const PORT = 8000;
const server = http_1.default.createServer((req, res) => {
    if (req.url == '/api' && req.method == 'GET') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.write('Hi there, this is a Vanilla Node.js API');
        res.end();
    }
});
server.listen(PORT, () => console.log(`Application run on port:${PORT}`));
