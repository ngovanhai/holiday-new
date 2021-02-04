import {
  Card,
  Form,
  FormLayout,
  Frame,
  Heading,
  Layout,
  Page,
  RadioButton,
  Scrollable,
  Select,
  Stack,
  TextField,
  Toast,
} from "@shopify/polaris";
import React, { useCallback, useEffect } from "react";
import moment from "moment";
import "antd/dist/antd.css";
import "./editAddEvent.scss";
import { useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { DatePicker, Checkbox, Row, Col } from "antd";
import { OPTION_ICON } from "contants/optionIcon";
import { Images } from "contants/images";
import { FRAMES } from "contants/frames";
import { useDispatch, useSelector } from "react-redux";
import { AddToEvent, UpdateEvent } from "store/eventSlice";
import eventApi from "api/EventApi";
import { shop } from "config";
import ImageApi from "api/ImageApi";
import FrameApi from "api/FrameApi";
import { AddAllFrames } from "store/framesSlice";
import { AddAllImages } from "store/imagesSlice";
import SaveBar from "component/saveBar";
import Models from "component/model";
import ChooseIcons from "component/chooseIcons";
import FramesGif from "component/frameGif";
import ShowEvent from "component/itemModelEdit/showEvent";
import { ChevronDownMinor } from "@shopify/polaris-icons";
import { ChevronUpMinor } from "@shopify/polaris-icons";
import Preview from "component/preview";
import useWindowSize from "component/windowResize";
const optionsTotal = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
];
const optionsSpeed = [
  { label: "Slow", value: "11" },
  { label: "Normal", value: "7" },
  { label: "Fast", value: "3" },
];
const optionsIconSize = [
  { label: "Small", value: "10" },
  { label: "Mediun", value: "20" },
  { label: "Large", value: "30" },
];
const optionsImageSize = [
  { label: "Small", value: "20" },
  { label: "Mediun", value: "40" },
  { label: "Large", value: "60" },
];
const optionEffect = [
  { label: "Ballon", value: "ballon" },
  { label: "New Year", value: "new_year" },
  { label: "New Year 2", value: "new_year_2" },
  { label: "Halloween ", value: "halloween2" },
  { label: "Valentine ", value: "valentine" },
  { label: "Rain ", value: "rain" },
  { label: "Rain 2", value: "rain2" },
  { label: "Snow", value: "snow" },
  { label: "Star", value: "star" },
  { label: "Star 2", value: "star2" },
  { label: "Wind", value: "wind" },
  { label: "None", value: "" },
];
const optionsShowFrame = [
  { label: "Only top", value: "1" },
  { label: "Only bottom", value: "2" },
  { label: "Both top and bottom", value: "3" },
];

function AddEditEvent(props) {
  let { id } = useParams();
  const history = useHistory();
  const isAddmode = !id;
  const dispatch = useDispatch();

  const [active, setActive] = useState(false);
  const handleChangeModel = useCallback(() => setActive(!active), [active]);

  const editedEvent = useSelector((state) =>
    state.events.find((x) => +x.id === +id)
  );
  const [valueOnlyHome, setValueOnlyHome] = useState(
    isAddmode ? "" : editedEvent.only_home
  );

  const [valueOtherPage, setValueOtherPage] = useState(
    isAddmode ? "" : editedEvent.other_page
  );
  const [titleEvent, setTitleEvent] = useState(
    isAddmode ? "" : editedEvent.event_name
  );
  const [totalIconImage, setTotalIconImage] = useState(
    isAddmode ? "10" : editedEvent.number_of_icons
  );
  const [animationSpeed, setAnimationSpeed] = useState(
    isAddmode ? "10" : editedEvent.animation_speed
  );
  const [iconSize, setIconSize] = useState(
    isAddmode ? "10" : editedEvent.icon_size
  );
  const [iconColor, setIconColor] = useState(
    isAddmode ? "" : editedEvent.icon_color
  );
  const [imageSize, setImageSize] = useState(
    isAddmode ? "20" : editedEvent.image_size
  );
  const [timeIcon, setTimIcon] = useState(
    isAddmode ? "20" : editedEvent.effect_time
  );
  const [timeFrame, setTimeFrame] = useState(
    isAddmode ? "20" : editedEvent.frame_time
  );
  const [checkedShowIconHome, setCheckedShowIconHome] = useState(
    isAddmode ? false : +editedEvent.only_home === 1 ? true : false
  );
  const [showFrame, setShowFrame] = useState(
    isAddmode ? "1" : editedEvent.frame_position
  );
  const [timeStart, setTimeStart] = useState();
  // isAddmode ? "" : editedEvent.start_date
  const [timeEnd, setTimeEnd] = useState();
  // isAddmode ? "" : editedEvent.end_date
  const [selectIcon, setSelectIcon] = useState(
    isAddmode ? "" : editedEvent.choose_icons
  );
  const [selectImages, setSelectImages] = useState(
    isAddmode ? "" : editedEvent.choose_images
  );
  const [selectImagesUpload, setSelectImagesUpload] = useState(
    isAddmode ? "" : editedEvent.custom_images
  );
  const [selectFrameUpload, setSelectFrameUpload] = useState(
    isAddmode ? "" : editedEvent.custom_frame
  );

  const [selectFrame, setSelectFrame] = useState(
    isAddmode ? "" : editedEvent.frames
  );
  const [selectEffect, setSelectEffect] = useState(
    isAddmode ? "" : editedEvent.effect_background
  );

  const [selectframeGif, setSelectFrameGif] = useState(
    isAddmode ? "" : editedEvent.frame_gif
  );
  const [showMoreFrame, setShowMoreFrame] = useState(
    !isAddmode ? (editedEvent.frames ? true : false) : false
  );
  const [showMoreFrameUpload, setShowMoreFrameUpload] = useState(
    !isAddmode ? (editedEvent.custom_frame ? true : false) : false
  );
  const [topFrame, setTopFrame] = useState(false);
  const [bottomFrame, setBottomFrame] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [value, setValue] = useState(
    isAddmode
      ? ""
      : editedEvent.frames === "" && editedEvent.custom_frame === ""
        ? "3"
        : editedEvent.frames === "" && editedEvent.frame_gif === ""
          ? "2"
          : "1"
  );
  const [grid, setGrid] = useState(6);
  const [showPreview, setShowPreview] = useState(true);
  const [activeToast, setActiveToast] = useState(false);
  const [contentToast, setContentToast] = useState("");
  const windowSize = useWindowSize();
  const FramesUpload = useSelector((state) => state.framesUpload);
  const ImagesUpload = useSelector((state) => state.imagesUpload);

  const handleChange = useCallback((_checked, newValue) => {
    setValue(newValue);
    if (+newValue === 1) {
      setSelectFrameUpload("");
      setSelectFrameGif("");
    } else if (+newValue === 2) {
      setSelectFrame("");
      setSelectFrameGif("");
    } else if (+newValue === 3) {
      setSelectFrameUpload("");
      setSelectFrame("");
    }
  }, []);

  useEffect(() => {
    if (windowSize.width > 1024) setGrid(6);
    if (windowSize.width > 720 && windowSize.width < 1024) setGrid(8);
    if (windowSize.width > 450 && windowSize.width < 720) setGrid(12);
    if (windowSize.width < 450) setGrid(12);
  }, [windowSize.width]);

  const randomId = () => {
    return Math.trunc(Math.random() * 100000000);
  };

  const getValueCheckboxImage = () => {
    let checkbox = document.getElementsByName("imageChoose");
    let result = "";
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        result += checkbox[i].value + ",";
      }
    }
    if (result !== "") {
      let arr = result.split(",")
      arr.splice(arr.length - 1, 1)
      const chooseImages = JSON.stringify(arr)
      setSelectImages(chooseImages)
    } else {
      setSelectImages([]);
    }
    return result;
  };
  const getValueCheckboxIcons = useCallback((result) => {
    if (result.length !== 0) {
      let arr = result.split(",")
      arr.splice(arr.length - 1, 1)
      const chooseIcons = JSON.stringify(arr)
      setSelectIcon(chooseIcons);
    } else {
      setSelectIcon([]);
    }

  }, []);
  const getValueCheckboxImageUpload = () => {
    let checkbox = document.getElementsByName("imageUploadChoose");
    let result = "";
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        result += checkbox[i].value + ",";
      }
    }
    if (result !== "") {
      let arr = result.split(",")
      arr.splice(arr.length - 1, 1)
      const chooseImagesUpload = JSON.stringify(arr)
      console.log(chooseImagesUpload);
      setSelectImagesUpload(chooseImagesUpload)
    } else {
      setSelectImagesUpload([]);
    }
    return result;
  };
  const getValueFrame = () => {
    setValue("1");
    let radio = document.getElementsByName("frames");
    let result;
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) result = radio[i].id;
    }
    let ele = document.getElementsByName("framesUpload");
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = false;
    }
    let ele2 = document.getElementsByName("framesGif");
    for (let i = 0; i < ele2.length; i++) {
      ele2[i].checked = false;
    }
    setSelectFrameUpload("");
    setSelectFrameGif("");
    setSelectFrame(result);
    console.log("upload", selectFrameUpload);
    return result;
  };
  const toggleActive = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );

  const toastMarkup = activeToast ? (
    <Toast content={contentToast} onDismiss={toggleActive} />
  ) : null;
  const getValueFrameUpload = () => {
    setValue("2");
    let radio = document.getElementsByName("framesUpload");
    let result;
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) result = radio[i].id;
    }
    let ele = document.getElementsByName("frames");
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = false;
    }
    let ele2 = document.getElementsByName("framesGif");
    for (let i = 0; i < ele2.length; i++) {
      ele2[i].checked = false;
    }
    setSelectFrame("");
    setSelectFrameGif("");
    setSelectFrameUpload(result);
    return result;
  };
  const handleSubmit = useCallback((value) => {
    if (titleEvent === "") {
      handleChangeModel();
    } else {
      const data = {
        action: "create",
        shop: shop,
        id: randomId(),
        event_name: titleEvent,
        publish: 0,
        number_of_icons: totalIconImage,
        animation_speed: animationSpeed,
        icon_size: iconSize,
        icon_color: iconColor,
        image_size: imageSize,
        choose_icons: selectIcon,
        choose_images: selectImages,
        frames: selectFrame,
        effect_time: timeIcon,
        frame_time: timeFrame,
        frame_position: showFrame,
        top_frame: topFrame,
        bottom_frame: bottomFrame,
        start_date: timeStart,
        end_date: timeEnd,
        custom_images: selectImagesUpload,
        custom_frame: selectFrameUpload,
        frame_gif: selectframeGif,
        other_page: valueOtherPage,
        only_home: valueOnlyHome,
        effect_background: selectEffect,
      };
      dispatch(AddToEvent(data));
      const saveEvent = async () => {
        setLoading(true);
        const res = await eventApi.create(data);
        setContentToast("Create event succes");
        toggleActive();
        setLoading(false);
        setTimeout(() => {
          onChangeHome();
        }, 500);
      };
      saveEvent();
    }
  });

  const handleEdit = useCallback((value) => {
    if (titleEvent === "") {
      handleChangeModel();
      return;
    } else {
      const dataUpdate = {
        action: "update",
        id: editedEvent.id,
        publish: editedEvent.publish,
        shop: shop,
        event_name: titleEvent,
        number_of_icons: totalIconImage,
        animation_speed: animationSpeed,
        icon_size: iconSize,
        icon_color: iconColor,
        image_size: imageSize,
        choose_icons: selectIcon,
        choose_images: selectImages,
        frames: selectFrame,
        effect_time: timeIcon,
        frame_time: timeFrame,
        frame_position: showFrame,
        top_frame: topFrame,
        bottom_frame: bottomFrame,
        start_date: timeStart,
        end_date: timeEnd,
        custom_images: selectImagesUpload,
        custom_frame: selectFrameUpload,
        frame_gif: selectframeGif,
        other_page: valueOtherPage,
        only_home: valueOnlyHome,
        effect_background: selectEffect,
      };
      dispatch(UpdateEvent(dataUpdate));
      const saveEvent = async () => {
        setLoading(true);
        await eventApi.update(dataUpdate);
        setLoading(false);
        setContentToast("Edit event success");
        toggleActive();
      };
      // saveEvent().then(() => {
      //   setTimeout(() => {
      //     onChangeHome();
      //   }, 500);
      // });
    }
  });

  const handelTileEvent = useCallback((value) => setTitleEvent(value), []);
  const handleSpeed = useCallback((value) => setAnimationSpeed(value), []);
  const handleTotalIconimage = useCallback(
    (value) => setTotalIconImage(value),
    []
  );
  const handleIconSize = useCallback((value) => setIconSize(value), []);
  const hanleColor = useCallback((value) => setIconColor(value), []);
  const handleImageSize = useCallback((value) => setImageSize(value), []);
  const hanldeEffect = useCallback((value) => {
    setSelectEffect(value);
  }, []);

  const handleTimeIcon = useCallback((value) => setTimIcon(value), []);
  const handleTimeFrame = useCallback((value) => setTimeFrame(value), []);
  const handleChangeShowHome = (e) => {
    setCheckedShowIconHome(e.target.checked);
  };

  const handleShowFrame = useCallback((value) => {
    setShowFrame(value);
    if (value === "1") {
      setTopFrame(true);
      setBottomFrame(false);
    } else if (value === "2") {
      setBottomFrame(true);
      setTopFrame(false);
    } else if (value === "3") {
      setBottomFrame(true);
      setTopFrame(true);
    }
  }, []);

  const handleEditCancel = () => {
    history.push("/holiday-effects/admin/client/build");
  };
  const handleHomeCancel = (id) => {
    history.push("/holiday-effects/admin/client/build");
  };
  const onChangeHome = () => {
    history.push("/holiday-effects/admin/client/build");
  };
  useEffect(() => {
    setTimeStart(
      isAddmode
        ? moment().format("YYYY-MM-DD HH:mm:ss")
        : editedEvent.start_date
    );
    setTimeEnd(isAddmode ? "" : editedEvent.end_date);
  }, []);

  const hanleTimeStart = useCallback((date, dateString) => {
    setTimeStart(dateString);
  }, []);
  const handleTimeEnd = (date, dateString) => {
    setTimeEnd(dateString);
  };

  const checked = (id) => {
    if (editedEvent) {
      return editedEvent.choose_images.search(new RegExp(id)) !== -1;
    }
  };
  const checkImageUpload = (id) => {
    let res;
    if (editedEvent) {
      const str = editedEvent.custom_images.split(",");
      for (let url in str) {
        if (str[url] === id) {
          res = true;
          break;
        } else {
          res = false;
        }
      }
    }
    return res;
  };
  const checkFrame = (id) => {
    if (editedEvent) {
      return editedEvent.frames.search(new RegExp(id)) !== -1;
    }
  };
  const checkFrameUpload = (id) => {
    let res;
    if (editedEvent) {
      const str = editedEvent.custom_frame.split(",");
      for (let url in str) {
        if (str[url] === id) {
          res = true;
          break;
        } else {
          res = false;
        }
      }
    }
    return res;
  };
  useEffect(() => {
    const fetchData = async () => {
      if (FramesUpload.length === 0) {
        const resFrame = await FrameApi.getAll();
        dispatch(AddAllFrames(resFrame));
      }
      if (ImagesUpload.length === 0) {
        const resImage = await ImageApi.getAll();
        dispatch(AddAllImages(resImage));
      }
    };
    fetchData();
  }, []);

  const clearFrame = () => {
    let ele = document.getElementsByName("frames");
    let ele2 = document.getElementsByName("framesUpload");
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = false;
      setSelectFrame("");
    }
    for (let i = 0; i < ele2.length; i++) {
      ele2[i].checked = false;
      setSelectFrameUpload("");
    }
  };
  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setShowPreview(false);
    }
  }, []);
  const hanleColor2 = (t) => {

    console.log(t.value);


  }
  return (
    <Frame>
      <div className="AddEditEvent" style={{ display: "flex" }}>
        {/* <div style={{ width: "60%" }} className="AddEditEvent__edit"> */}
        <Card>
          <Models
            handleChange={handleChangeModel}
            active={active}
            content="this Event's Title is requried"
            title="Errors"
            onClickDelete={isAddmode ? onChangeHome : handleEditCancel}
            textButton="Go Home"
          />
          <SaveBar
            onSave={handleSubmit}
            onHomeCancel={handleHomeCancel}
            onEditCancel={handleEditCancel}
            onSaveEdit={handleEdit}
            isAddmode={isAddmode}
            Loading={Loading}
          />
          <div>
            <h3 className="AddEditEvent__title">
              {isAddmode ? (
                <Heading>Create new event</Heading>
              ) : (
                  <Heading>{`Edit ${editedEvent.event_name} Event`}</Heading>
                )}
            </h3>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  value={titleEvent}
                  onChange={handelTileEvent}
                  label="Title's event"
                />
                <Select
                  label="Total of icons/images"
                  options={optionsTotal}
                  onChange={handleTotalIconimage}
                  value={totalIconImage}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <Select
                  label="Animation speed"
                  options={optionsSpeed}
                  onChange={handleSpeed}
                  value={animationSpeed}
                />
                <Select
                  label="Icon size"
                  options={optionsIconSize}
                  onChange={handleIconSize}
                  value={iconSize}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <div style={{ display: "flex" }}>
                  <div className="AddEditEvent__textColor">
                    <TextField
                      value={iconColor}
                      onChange={hanleColor}
                      label="Icons color"
                    >
                    </TextField>
                  </div>
                  <div className="AddEditEvent__Color">
                    <TextField
                      value={iconColor}
                      onChange={hanleColor}
                      label="color"
                      type="color"
                      id="bgcolor"
                    />
                  </div>

                </div>
                <Select
                  options={optionsImageSize}
                  onChange={handleImageSize}
                  value={imageSize}
                  label="Image size"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  onChange={handleTimeIcon}
                  value={timeIcon}
                  min="0"
                  label="Time to keep icons and images effect on store- keep 0 value for forever ( Second )"
                  type="number"
                />
                <TextField
                  onChange={handleTimeFrame}
                  value={timeFrame}
                  min="0"
                  label="Time to keep frame on store ( Second )"
                  type="number"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <ShowEvent
                  vertical={false}
                  setValueOtherPage={setValueOtherPage}
                  setValueOnlyHome={setValueOnlyHome}
                  editedEvent={editedEvent ? editedEvent : null}
                />
                <Select
                  options={optionsShowFrame}
                  onChange={handleShowFrame}
                  value={showFrame}
                  label="Show frame"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <div>
                  <p>Start date</p>
                  <DatePicker
                    className="AddEditEvent__datepicker"
                    format="YYYY-MM-DD HH:mm:ss"
                    defaultValue={
                      isAddmode ? moment() : moment(editedEvent.start_date)
                    }
                    onChange={hanleTimeStart}
                    showTime
                  />
                </div>
                <div>
                  <p>End date</p>
                  <DatePicker
                    className="AddEditEvent__datepicker"
                    format="YYYY-MM-DD HH:mm:ss"
                    defaultValue={
                      isAddmode
                        ? ""
                        : editedEvent.end_date === "0000-00-00 00:00:00" ||
                          editedEvent.end_date === ""
                          ? ""
                          : moment(editedEvent.end_date)
                    }
                    onChange={handleTimeEnd}
                    showTime
                  />
                </div>
              </FormLayout.Group>
              <FormLayout.Group>
                <h1>Choose effect</h1>
                <Select
                  options={optionEffect}
                  onChange={hanldeEffect}
                  value={selectEffect}
                />
              </FormLayout.Group>
              <h1>Choose icons</h1>
              <Scrollable shadow style={{ height: "200px" }}>
                <ChooseIcons
                  OPTION_ICON={OPTION_ICON}
                  editedEvent={editedEvent ? editedEvent : ""}
                  onClickChooseIcons={getValueCheckboxIcons}
                  color={iconColor}
                  isAddmode={isAddmode}
                />
              </Scrollable>
              <h1>Choose images</h1>
              <Scrollable shadow style={{ height: "200px" }}>
                <ul>
                  {Images.map((image, key) => (
                    <li key={key}>
                      <input
                        type="checkbox"
                        className="AddEditEvent__inputCheckbox"
                        name="imageChoose"
                        id={image.id}
                        value={image.id}
                        onChange={getValueCheckboxImage}
                        defaultChecked={isAddmode ? false : checked(image.id)}
                      />
                      <label
                        htmlFor={image.id}
                        className="AddEditEvent__images"
                      >
                        <img src={image.url} alt="" />
                      </label>
                    </li>
                  ))}
                  {ImagesUpload.map((image, key) => (
                    <li key={key}>
                      <input
                        type="checkbox"
                        className="AddEditEvent__inputCheckbox"
                        name="imageUploadChoose"
                        id={image.url}
                        value={image.url}
                        onChange={getValueCheckboxImageUpload}
                        defaultChecked={
                          isAddmode ? false : checkImageUpload(image.url)
                        }
                      />
                      <label
                        htmlFor={image.url}
                        className="AddEditEvent__images"
                      >
                        <img src={image.url} alt="" />
                      </label>
                    </li>
                  ))}
                </ul>
              </Scrollable>
              <h1> Choose frames</h1>
              <p onClick={clearFrame} className="AddEditEvent__clearFrame">
                Clear frame's selection
              </p>
              <Scrollable shadow style={{ height: "400px" }}>
                <div className="AddEditEvent_Frame">
                  <Heading>Frames upload</Heading>
                  <div id="FrameUpload" className="AddEditEvent__imageFrame">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      {FramesUpload.map((frame, index) => (
                        <Col className="gutter-row" span={grid} key={index}>
                          <div className="AddEditEvent__imageFrame">
                            <input
                              type="radio"
                              name="framesUpload"
                              id={frame.url}
                              className="input-hidden"
                              onChange={getValueFrameUpload}
                              defaultChecked={
                                isAddmode ? false : checkFrameUpload(frame.url)
                              }
                            />
                            <label htmlFor={frame.url}>
                              <img
                                src={frame.url}
                                className="AddEditEvent__Frameimg"
                                alt=""
                              />
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    <div
                      className="AddEditEvent__action"
                      style={FramesUpload.length < 7 ? { display: "none" } : {}}
                    >
                      <ChevronDownMinor
                        className="AddEditEvent__icon AddEditEvent__down "
                        style={showMoreFrameUpload ? { display: "none" } : {}}
                        onClick={() => setShowMoreFrameUpload(true)}
                      />
                      <ChevronUpMinor
                        className="AddEditEvent__icon AddEditEvent__up"
                        style={showMoreFrameUpload ? {} : { display: "none" }}
                        onClick={() => setShowMoreFrameUpload(false)}
                      />
                    </div>
                    <Row
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                      style={showMoreFrameUpload ? {} : { display: "none" }}
                    >
                      {FramesUpload.map((frame, index) => (
                        <Col className="gutter-row" span={grid} key={index}>
                          <div className="AddEditEvent__imageFrame">
                            <input
                              type="radio"
                              name="framesUpload"
                              id={frame.url}
                              className="input-hidden"
                              onClick={getValueFrameUpload}
                              defaultChecked={
                                isAddmode ? false : checkFrameUpload(frame.url)
                              }
                            />
                            <label htmlFor={frame.url}>
                              <img
                                src={frame.url}
                                className="AddEditEvent__Frameimg"
                                alt=""
                              />
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <div id="Frame" className="AddEditEvent__frames">
                    <Heading>Frames sample</Heading>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      {FRAMES.slice(0, 4).map((frame, index) => (
                        <Col className="gutter-row" span={grid} key={index}>
                          <div className="AddEditEvent__imageFrame">
                            <input
                              type="radio"
                              name="frames"
                              id={frame.id}
                              className="input-hidden"
                              onChange={getValueFrame}
                              defaultChecked={
                                isAddmode ? false : checkFrame(frame.id)
                              }
                            />
                            <label htmlFor={frame.id}>
                              <img
                                src={frame.url}
                                className="AddEditEvent__Frameimg"
                                alt=""
                              />
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    <div
                      className="AddEditEvent__action"
                      style={FRAMES.length < 7 ? { display: "none" } : {}}
                    >
                      <ChevronDownMinor
                        className="AddEditEvent__icon AddEditEvent__down "
                        style={showMoreFrame ? { display: "none" } : {}}
                        onClick={() => setShowMoreFrame(true)}
                      />
                      <ChevronUpMinor
                        className="AddEditEvent__icon AddEditEvent__up"
                        style={showMoreFrame ? {} : { display: "none" }}
                        onClick={() => setShowMoreFrame(false)}
                      />
                    </div>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      {FRAMES.slice(6).map((frame, index) => (
                        <Col
                          className="gutter-row"
                          span={grid}
                          key={index}
                          style={showMoreFrame ? {} : { display: "none" }}
                        >
                          <div className="AddEditEvent__imageFrame">
                            <input
                              type="radio"
                              name="frames"
                              id={frame.id}
                              className="input-hidden"
                              onChange={getValueFrame}
                              defaultChecked={
                                isAddmode ? false : checkFrame(frame.id)
                              }
                            />
                            <label htmlFor={frame.id}>
                              <img
                                src={frame.url}
                                className="AddEditEvent__Frameimg"
                                alt=""
                              />
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
                <div
                  style={{
                    display: +value === 1 || +value === 3 ? "none" : "block",
                  }}
                ></div>
                <Heading> Animation Frames</Heading>
                <FramesGif
                  value={value}
                  handleChange={handleChange}
                  isAddmode={isAddmode}
                  editedEvent={editedEvent ? editedEvent : null}
                  setValue={setValue}
                  setSelectFrame={setSelectFrame}
                  selectFrame={selectFrame}
                  selectFrameUpload={selectFrameUpload}
                  setSelectFrameUpload={setSelectFrameUpload}
                  setSelectFrameGif={setSelectFrameGif}
                  grid={grid}
                />
              </Scrollable>
            </FormLayout>
          </div>
        </Card>
        {/* {showPreview === true ? (
          <Preview
            frameUpload={selectFrameUpload}
            frame_gif={selectframeGif}
            frame={selectFrame}
            icon={selectIcon}
            image={selectImages}
            number_of_icons={totalIconImage}
            iconColor={iconColor}
            animation_speed={animationSpeed}
            icon_size={iconSize}
            icon_color={iconColor}
            image_size={imageSize}
            effect_time={timeIcon}
            frame_time={timeFrame}
            showFrame={showFrame}
            selectEffect={selectEffect}
            imageUpload={selectImagesUpload}
            grid={grid}
          />
        ) : null} */}
      </div>
      {toastMarkup}
    </Frame>
  );
}

export default AddEditEvent;
