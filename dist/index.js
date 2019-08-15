"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLineLogger = function (options) {
    if (options === void 0) { options = {}; }
    return function (reducer) {
        var open = false;
        var ws = new WebSocket("ws://localhost:" + (options.port || 8080));
        ws.onopen = function () {
            open = true;
        };
        ws.onmessage = function (event) {
            console.log(JSON.parse(event.data));
        };
        return function (state, action) {
            var newState = reducer(state, action);
            if (open) {
                var msg = undefined;
                try {
                    msg = JSON.stringify({
                        state: state,
                        action: action,
                        newState: newState
                    });
                }
                catch (e) {
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
};
//# sourceMappingURL=index.js.map