import { ActionReducer } from '@ngrx/store';

export const CommandLineLogger = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return function(state, action) {
    console.log('x state', state);
    console.log('x action', action);

    const newState = reducer(state, action);
    console.log('x2 newState', newState);
    return newState;
  };
}
