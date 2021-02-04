import React, { useEffect } from "react";
import "./App.css";
// import { BrowserRouter, Route, Router, Switch, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddToEvents } from "store/eventSlice";
import eventApi from "api/EventApi";
import HomePage from "pages/HomePage";
import AddEditEvent from "pages/editAddEvent";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AddToEventsSample } from "store/eventsSampletSlice";
import Setting from "pages/setting";
import Document from "pages/document";
import SettingApi from "api/SettingsApi";
import { AddToSettings } from "store/settingsSlice";
import Preview from "component/preview";

export default function App() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  useEffect(() => {
    const fetchData = async () => {
      const resEvents = await eventApi.getAll();
      const resEventsSample = await eventApi.getEventSample();
      const resSettings = await SettingApi.getAll();
      dispatch(AddToEventsSample(resEventsSample));
      dispatch(AddToEvents(resEvents));
      dispatch(AddToSettings(resSettings))
    };
    if (events.length === 0) {
      fetchData();
    }
  }, []);
  return (
    <div>
      <Router>
        <Switch>
          <Route
            path="/holiday-effects/admin/client/build/addEdit/:id"
            component={AddEditEvent}
          />
          <Route path="/holiday-effects/admin/client/build/addEdit">
            <AddEditEvent />
          </Route>
          <Route path="/holiday-effects/admin/client/build">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
