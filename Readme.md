# Ngrx Command Line Logger

Print in the terminal your project NGRX actions via websockets.

![Example action](img/inc.gif?raw=true "Example action")

### Installing

```bash
$ npm i --save-dev ngrx-command-line-logger
```

## Usage

Add ngrx-command-line-logger as ngrx meta-reducer.

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';
import { CommandLineLogger } from 'ngrx-command-line-logger';

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

metaReducers.push(CommandLineLogger({
  port: 8080 // default
}));

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Run the repl logger
```bash
$ npx ngrx-cll --port 8080
```

## REPL

`$.client({})`: Send an object to the client devtools.

```bash
> $.client($.history)
> $.client() // last state
```

![Example client command](img/client.gif?raw=true "Example client command")

`$.history`: Last 100 entries (state, action & diff).

`$.last`: Last entry.

`$.state`: Current state.

`$.log({})`: Deep JSON log. Example: `$.log($.state)`