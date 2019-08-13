import WebSocket from 'ws';
import chalk from 'chalk';
import { diffString } from 'json-diff';
import repl from 'repl';
import util from 'util';

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

const wss = new WebSocket.Server({
  port: parseInt(args.port, 10)
});

function deepLog(obj: {}) {
  console.log(util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
    compact: false
  }));
  // console.log(JSON.stringify(obj, null, 2));
}

function breakLine(lines = 1) {
  for(let i = 0; i < lines; i++) {
    console.log('');
  }
}

let lastMessage:any = {
  action: null,
  state: null,
  newState: null
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: string) {
    const obj: {
      action: string;
      state: any,
      newState: any
    } = JSON.parse(message);

    breakLine();
    console.log(chalk.bold.bgGreen(' Action '), ' ', new Date());
    deepLog(obj.action);

    breakLine();

    console.log(chalk.bgHex('#FF8800').bold(' Diff '));
    console.log(diffString(obj.state, obj.newState));

    breakLine(2);

    replServer.displayPrompt();

    lastMessage = obj;
  });
});

const replServer = repl.start({
  completer: (line: any) => {
    const completions = [
      '.old',
      '.new',
      '.exit'
      // dispatch() TODO
    ];

    const hits = completions.filter(function(c) { return c.indexOf(line) == 0 });

    return [hits.length ? hits : completions, line]
  }
});

replServer.defineCommand('old', {
  help: 'Old state',
  action() {
    this.clearBufferedCommand();
    breakLine();
    deepLog(lastMessage.state);
    breakLine();
    this.displayPrompt();
  }
});

replServer.defineCommand('new', {
  help: 'New state',
  action() {
    this.clearBufferedCommand();
    breakLine();
    deepLog(lastMessage.newState);
    breakLine();
    this.displayPrompt();
  }
});

replServer.on('exit', () => {
  wss.close();
  process.exit();
});
