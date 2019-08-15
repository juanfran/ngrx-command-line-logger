"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var chalk_1 = __importDefault(require("chalk"));
var json_diff_1 = require("json-diff");
var repl_1 = __importDefault(require("repl"));
var util_1 = __importDefault(require("util"));
function deepLog(obj) {
    console.log(util_1.default.inspect(obj, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false
    }));
    // console.log(JSON.stringify(obj, null, 2));
}
var messages = [];
var globalContext = {
    get history() {
        return messages;
    },
    get last() {
        return messages.slice(-1)[0];
    },
    get state() {
        return this.last.newState;
    },
    client: function (message) {
        if (!message) {
            sendClients(JSON.stringify(this.state));
        }
        else {
            sendClients(JSON.stringify(message));
        }
    },
    log: deepLog
};
var replServer;
var args = process.argv.slice(2).reduce(function (prev, current, index, list) {
    var _a;
    if (current.startsWith('--') && list[index + 1]) {
        return __assign({}, prev, (_a = {}, _a[current.replace('--', '')] = list[index + 1], _a));
    }
    return __assign({}, prev);
}, {
    port: '8080'
});
var clients = [];
var wss = new ws_1.default.Server({
    port: parseInt(args.port, 10)
});
function breakLine(lines) {
    if (lines === void 0) { lines = 1; }
    for (var i = 0; i < lines; i++) {
        console.log('');
    }
}
function sendClients(msg) {
    clients.forEach(function (client) {
        client.send(msg);
    });
}
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        var objMsg = JSON.parse(message);
        var obj = __assign({}, objMsg, { diff: json_diff_1.diffString(objMsg.state, objMsg.newState) });
        breakLine();
        console.log(chalk_1.default.bold.bgGreen(' Action '), ' ', new Date());
        deepLog(obj.action);
        breakLine();
        console.log(chalk_1.default.bgHex('#FF8800').bold(' Diff '));
        console.log(obj.diff);
        breakLine(2);
        replServer.displayPrompt();
        messages.push(obj);
        if (messages.length > 100) {
            messages.shift();
        }
    });
    clients.push(ws);
});
function createReplServer() {
    replServer = repl_1.default.start();
    Object.defineProperty(replServer.context, '$', {
        configurable: false,
        enumerable: true,
        value: globalContext
    });
    replServer.on('exit', function () {
        wss.close();
        process.exit();
    });
}
createReplServer();
//# sourceMappingURL=server.js.map