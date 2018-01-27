import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";

import App from "./components/App";
import Model from "./model";

const store = new Model();

render(
  <div>
    {/* <DevTools /> */}
    <App store={store} />
  </div>,
  document.getElementById("root")
);

window.store = store;