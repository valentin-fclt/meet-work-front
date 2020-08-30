import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components";
import * as serviceWorker from "./serviceWorker";

import "@atlaskit/css-reset/dist/bundle.css";
import "@atlaskit/reduced-ui-pack/dist/bundle.css";
import "./index.css";
import { firebase } from "./services";

firebase.initialize();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
