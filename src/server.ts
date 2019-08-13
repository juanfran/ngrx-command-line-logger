import WebSocket from 'ws';
import chalk from 'chalk';
import { diffString } from 'json-diff';
import repl from 'repl';
import util from 'util';
import { Action } from '@ngrx/store';

interface Message {
  action: Action;
  state: any,
  newState: any,
  diff: string
}

function deepLog(obj: {}) {
  console.log(util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
    compact: false
  }));
  // console.log(JSON.stringify(obj, null, 2));
}

const messages: Message[] = [];

const globalContext = {
  get history() {
    return messages;
  },
  get last() {
    return messages.slice(-1)[0];
  },
  get state() {
    return this.last.newState;
  },
  client: function (message?: object) {
    if(!message) {
      sendClients(JSON.stringify(this.state));
    } else {
      sendClients(JSON.stringify(message));
    }
  },
  log: deepLog
};
let replServer: repl.REPLServer;

const args = process.argv.slice(2).reduce((prev, current, index, list) => {
  if (current.startsWith('--') && list[index + 1]) {
    return {
      ...prev,
      [current.replace('--', '')]: list[index + 1]
    };
  }

  return {
    ...prev
  };
}, {
  port: '8080'
});

const clients: WebSocket[] = [];

const wss = new WebSocket.Server({
  port: parseInt(args.port, 10)
});

function breakLine(lines = 1) {
  for(let i = 0; i < lines; i++) {
    console.log('');
  }
}

function sendClients(msg: string) {
  clients.forEach((client) => {
    client.send(msg);
  });
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: string) {
    const objMsg = JSON.parse(message);

    const obj: Message = {
      ...objMsg,
      diff: diffString(objMsg.state, objMsg.newState)
    };

    breakLine();
    console.log(chalk.bold.bgGreen(' Action '), ' ', new Date());
    deepLog(obj.action);

    breakLine();

    console.log(chalk.bgHex('#FF8800').bold(' Diff '));
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
  replServer = repl.start();

  Object.defineProperty(replServer.context, '$', {
    configurable: false,
    enumerable: true,
    value: globalContext
  });

  replServer.on('exit', () => {
    wss.close();
    process.exit();
  });
}

createReplServer();
