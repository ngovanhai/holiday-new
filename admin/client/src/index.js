import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import store from "app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <AppProvider i18n={enTranslations}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppProvider>,
  document.getElementById("root")
);
reportWebVitals();
