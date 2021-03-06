import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";

import App from "./components/App";
import Model from "./store";

import { runGitWatcher } from './monitor';

const store = Model;
window.store = store;

runGitWatcher()

// const {ipcRenderer} = require('electron');

// ipcRenderer.on('message', function(event, text) {
//   console.log(event, text)
// })

render(
  <div>
    {/* <DevTools /> */}
    <App store={store} />
  </div>,
  document.getElementById("root")
);

