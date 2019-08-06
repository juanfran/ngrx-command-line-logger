# Ngrx Command line logger

Log in the terminal your project ngrx actions via websockets

### Installing

```
npm i --save-dev ngrx-command-line-logger
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

Run the logger
```bash
npx ngrx-cll --port 8080
```
