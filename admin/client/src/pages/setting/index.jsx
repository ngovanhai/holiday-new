import {
  Card,
  FormLayout,
  Layout,
  SettingToggle,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import SettingApi from "api/SettingsApi";
import React, { useCallback, useEffect, useState } from "react";
import { OnOff, publish } from "store/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./setting.scss";
import { Switch } from "antd";

function Setting(props) {
  const settings = useSelector((state) => state.settings);
  const [activeOnOff, setActiveOnOff] = useState(
    settings ? (settings[0].turn_onoff === "1" ? true : false) : false
  );
  const [autoPublish, setAutoPublish] = useState(
    settings ? (settings[0].autoPublish === "1" ? true : false) : false
  );
  const dispatch = useDispatch();



  const handleToggleOnOff = async (checked) => {
    await SettingApi.activeTurnOff(checked ? 1 : 0);
    dispatch(OnOff(checked));
  };
  const handleToggleAutopublish = async (checked) => {
    await SettingApi.activeAutoPublish(checked ? 1 : 0);
    dispatch(publish(checked));
  };
  return (
    <Card>
      <Layout>
        <Layout.AnnotatedSection title="Disable app">
          <FormLayout>
            <Switch defaultChecked={activeOnOff} onChange={handleToggleOnOff} />
          </FormLayout>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Auto publish event"
          description="When there is no event running, the app will automatically launch the event with the nearest start time."
        >
          <Switch
            defaultChecked={autoPublish}
            onChange={handleToggleAutopublish}
          />
        </Layout.AnnotatedSection>
      </Layout>
    </Card>
  );
}

export default Setting;
