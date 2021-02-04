import React, { useCallback, useEffect, useRef, useState } from "react";
import "./HomePage.scss";

import ListTable from "component/table";
import { useHistory } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  Icon,
  Layout,
  Page,
  Stack,
  Subheading,
  Tabs,
  TextStyle,
} from "@shopify/polaris";

import { shop } from "config";
import CreateEvent from "component/createEvent";
import Setting from "pages/setting";
import Assets from "pages/assets";
import Document from "pages/document";
import { useDispatch, useSelector } from "react-redux";
import { ActiveRedux } from "store/eventSlice";
import useWindowSize from "component/windowResize";
import { ChevronDownMinor } from "@shopify/polaris-icons";
import { ChevronUpMinor } from "@shopify/polaris-icons";
function HomePage(props) {
  const dispatch = useDispatch();
  const [namePage, setNamePage] = useState("Events");
  const windowSize = useWindowSize();
  const [reponsiveMenu, setReponsiveMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();
  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    if (windowSize.width < 500) setReponsiveMenu(true);
    else setReponsiveMenu(false);
  }, [windowSize.width]);
  const settings = useSelector((state) => state.settings);
  let setting = settings[0];
  const listEvents = useSelector((state) => state.events);
  const eventActive = listEvents.filter((event) => +event.publish === 1);
  const date = new Date();
  const dateStr =
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  const nowDate = new Date(dateStr);
  useEffect(() => {
    if (listEvents.length !== 0 && eventActive.length === 0) {
      if (setting && +setting.autoPublish === 1) {
        let newEvent = [...listEvents];
        newEvent = newEvent.filter(
          (event) =>
            new Date(event.end_date).valueOf() >= new Date(nowDate).valueOf() ||
            event.end_date === "0000-00-00 00:00:00"
        );
        newEvent = newEvent.sort((a, b) =>
          a.start_date.localeCompare(b.start_date)
        );
        if (newEvent.length !== 0) {
          dispatch(ActiveRedux(newEvent[0].id));
        }
      }
    }
  }, [settings]);
  return (
    <Page className="HomePage" fullWidth>
      <Layout>
        <Layout.Section>
          <div
            className="HomePage__header"
            style={reponsiveMenu ? { display: "inline" } : {}}
          >
            <h5 className="HomePage__namePage">{namePage}</h5>
            {reponsiveMenu ? (
              <div className="HomePage__menu">
                {showMenu ? (
                  <div>
                    <Stack>
                      <Stack.Item>
                        <Button onClick={() => setNamePage("Events")}>
                          Events
                        </Button>
                      </Stack.Item>
                      <Stack.Item>
                        <Button onClick={() => setNamePage("Settings")}>
                          Settings
                        </Button>
                      </Stack.Item>
                      <Stack.Item>
                        <Button onClick={() => setNamePage("Assets")}>
                          Assets
                        </Button>
                      </Stack.Item>
                      <Stack.Item>
                        <Button onClick={() => setNamePage("Document")}>
                          Document
                        </Button>
                      </Stack.Item>
                    </Stack>
                  </div>
                ) : null}

                <span className="HomePage__toogleMenu">
                  <i className="fa fa-bars" onClick={toggleShowMenu}></i>
                </span>
              </div>
            ) : (
                <div style={{ float: "right" }} className="HomePage__menu">
                  <ButtonGroup>
                    {namePage === "Events" ? (
                      <Button primary onClick={() => setNamePage("Events")}>
                        Events
                      </Button>
                    ) : (
                        <Button onClick={() => setNamePage("Events")}>
                          Events
                        </Button>
                      )}
                    {namePage === "Settings" ? (
                      <Button primary onClick={() => setNamePage("Settings")}>
                        Settings
                      </Button>
                    ) : (
                        <Button onClick={() => setNamePage("Settings")}>
                          Settings
                        </Button>
                      )}
                    {namePage === "Assets" ? (
                      <Button primary onClick={() => setNamePage("Assets")}>
                        Assets
                      </Button>
                    ) : (
                        <Button onClick={() => setNamePage("Assets")}>
                          Assets
                        </Button>
                      )}
                    {namePage === "Document" ? (
                      <Button primary onClick={() => setNamePage("Document")}>
                        Document
                      </Button>
                    ) : (
                        <Button onClick={() => setNamePage("Document")}>
                          Document
                        </Button>
                      )}
                  </ButtonGroup>
                </div>
              )}
          </div>
        </Layout.Section>
        <Layout.Section>
          {namePage === "Events" ? <CreateEvent /> : null}
          {namePage === "Settings" ? <Setting /> : null}
          {namePage === "Assets" ? <Assets /> : null}
          {namePage === "Document" ? <Document /> : null}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default HomePage;
