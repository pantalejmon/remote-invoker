import fs from 'fs';
import {spawn} from "child_process";
import http from "http";

let EXECUTION_FLAG = false;

async function parseConfig() {
    try {
        const byteConfig = await fs.promises.readFile('config.json');
        return JSON.parse(byteConfig)
    } catch (e) {
        console.error(e);
        process.exit()
    }
}

async function execute(commands) {
    const shell = spawn('/bin/bash')
    shell.on("spawn", () => EXECUTION_FLAG = true)
    shell.on('exit', () => EXECUTION_FLAG = false);
    shell.stdout.on('data', data => console.log(data.toString()));
    commands.forEach(cmd => shell.stdin.write(`${cmd}\n`))
    shell.stdin.end()
}

function handleRequest(request, response, config) {
    if (!request.headers[config['magic-token-header'].toLowerCase()]
        || request.headers[config['magic-token-header'].toLowerCase()] !== config['magic-token']
        || request.method !== 'PATCH'
        || request.url !== '/') {
        response.statusCode = 418;
        response.write('nope');
        response.end();
        return;
    }

    if (EXECUTION_FLAG) {
        response.statusCode = 429;
        response.write('I am so busy');
        response.end();
        return;
    }

    response.write('Make it done!');
    execute(config.commands)
    response.end();
}

function createServer(config) {
    const server = http.createServer();
    server.on('request', (req, res) => handleRequest(req, res, config))
    server.on('listening', () => console.log(`Server started on port: ${config.port}`))

    server.listen(config.port);
}

parseConfig().then(createServer);