import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Checkbox,
  FormLayout,
  Heading,
  Modal,
  RadioButton,
  Select,
  Stack,
  TextField,
} from "@shopify/polaris";
import ShowEvent from "component/itemModelEdit/showEvent";
import TimeStart from "component/itemModelEdit/timeStart";
import TimeEnd from "component/itemModelEdit/timeEnd";
import moment from "moment";
import eventApi from "api/EventApi";
import { shop } from "config";
import { useDispatch, useSelector } from "react-redux";
import { AddToEvent } from "store/eventSlice";
import { random } from "contants/function";

ModelEditEventSample.propTypes = {};
const optionsSpeed = [
  { label: "Slow", value: "11" },
  { label: "Normal", value: "7" },
  { label: "Fast", value: "3" },
];
function ModelEditEventSample(props) {
  const {
    toggleActive,
    toggleActiveToast,
    active,
    editEventSample,
    isEditMode,
    setContentToast,
    changeHome,
  } = props;
  const [valueOnlyHome, setValueOnlyHome] = useState(false);
  const [valueOtherPage, setValueOtherPage] = useState("");
  const [effect_time, setEffectTime] = useState("20");
  const [animationSpeed, setAnimationSpeed] = useState("7");
  const [timeStartEffect, setTimeStartEffect] = useState();
  const [timeEndEffect, setTimeEndEffect] = useState();
  const dispatch = useDispatch();
  const handleChangeTimeEffect = useCallback(
    (newValue) => setEffectTime(newValue),
    []
  );
  const handleChangeAnimationSpeed = useCallback(
    (newValue) => setAnimationSpeed(newValue),
    []
  );
  useEffect(() => {
    setTimeStartEffect(moment().format("YYYY-MM-DD HH:mm:ss"));
    setTimeEndEffect("");
  }, []);

  const editEffectSample = async () => {
    const data = {
      only_home: valueOnlyHome,
      effect_time: effect_time,
      animation_speed: animationSpeed,
      other_page: valueOtherPage,
      start_date: timeStartEffect,
      end_date: timeEndEffect,
      frame_time: effect_time,
      effect_background: "snow",
      shop: shop,
      id: random(),
      publish: "0",
      action: "create",
    };
    const saveEvent = async () => {
      const res = await eventApi.create({ ...data, ...editEventSample });
      if (res === "succsess") {
        setContentToast("Create event success");
        toggleActiveToast();
        toggleActive();
        dispatch(AddToEvent({ ...data, ...editEventSample }));
        setTimeout(() => {
          changeHome();
          console.log("hello");
        }, 500);
      }
    };
    saveEvent();
  };

  return (
    <div>
      <Modal
        large
        open={active}
        onClose={toggleActive}
        title={
          editEventSample
            ? "Configure for effect " + editEventSample.event_name
            : null
        }
        primaryAction={{
          content: "Confirm",
          onAction: () => editEffectSample(editEventSample.id),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleActive,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <div>
                <Heading>Show event on page</Heading>
                <ShowEvent
                  vertical={true}
                  setValueOtherPage={setValueOtherPage}
                  setValueOnlyHome={setValueOnlyHome}
                />
              </div>
              <div>
                <Heading>Time to keep event (Second)</Heading>
                <TextField
                  type="number"
                  value={effect_time}
                  onChange={handleChangeTimeEffect}
                  min={0}
                />
                <Heading>Animation speed</Heading>
                <Select
                  options={optionsSpeed}
                  onChange={handleChangeAnimationSpeed}
                  value={animationSpeed}
                />
                <Heading>Time start event</Heading>
                <TimeStart
                  isEditMode={isEditMode}
                  setTimeStartEffect={setTimeStartEffect}
                />
                <Heading>Time end event</Heading>
                <TimeEnd
                  isEditMode={isEditMode}
                  setTimeEndEffect={setTimeEndEffect}
                />
              </div>
            </FormLayout.Group>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ModelEditEventSample;
