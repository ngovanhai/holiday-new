import React, { Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddToEvents } from "store/eventSlice";
import eventApi from "api/EventApi";
import { rootlink } from "config";
//import HomePage from "pages/HomePage";

const HomePage = React.lazy(() => import("pages/HomePage"));
const AddEditEvent = React.lazy(() => import("pages/editAddEvent"));

function App() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  console.log(window.location.pathname)


  useEffect(() => {
    const fetchData = async () => {
      const res = await eventApi.getAll();
      dispatch(AddToEvents(res));
    };
    if (events.length === 0) {
      fetchData();
    }
  }, []);
  return (
    <div className="App">
      {/* //  <HomePage /> */}
      <BrowserRouter>
        <Suspense fallback={<div>Loading ...</div>}>
          <Switch>
            <Route exact path='/holiday-app2/admin/client/build' component={HomePage}></Route>
            <Route path="/holiday-app2/admin/client/build/addEdit" component={AddEditEvent}></Route>
            <Route path="/holiday-app2/admin/client/build/:id/addEdit" component={AddEditEvent}></Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
