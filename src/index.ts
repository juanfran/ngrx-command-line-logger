import { ActionReducer } from '@ngrx/store';

interface Options {
  port?: number;
}

export const CommandLineLogger = (options: Options = {}) => {
  return (reducer: ActionReducer<any>): ActionReducer<any> => {

    let open = false;
    const ws = new WebSocket(`ws://localhost:${options.port || 8080}`);

    ws.onopen = () => {
      open = true;
    };

    return function(state, action) {
      const newState = reducer(state, action);

      if (open) {
        let msg: string | undefined = undefined;

        try {
          msg = JSON.stringify({
            state,
            action,
            newState
          });
        } catch(e) {
          console.error('ngrx-command-line-logger: error stringify');
          console.error(e, e.stack);
        }

        if (msg) {
          ws.send(msg);
        }
      }

      return newState;
    };
  };
}
