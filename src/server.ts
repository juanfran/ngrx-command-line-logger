import WebSocket from 'ws';
import chalk from 'chalk';

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
  console.dir(obj, {depth: null, colors: true})
}

function breakLine(lines = 1) {
  for(let i = 0; i < lines; i++) {
    console.log('');
  }
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message: string) {
    const obj: {
      action: string;
      state: any,
      newState: any
    } = JSON.parse(message);

    console.log(chalk.bold.bgGreen(' Action '), ' ', new Date());
    deepLog(obj.action);

    breakLine();
    console.log(chalk.bgHex('#FF8800').bold(' Old state '));
    deepLog(obj.state);

    breakLine();
    console.log(chalk.bold.bgCyan(' New state '));
    deepLog(obj.newState);

    breakLine(2);
  });
});
