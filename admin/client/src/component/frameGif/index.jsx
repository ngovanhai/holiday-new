import React from "react";
import PropTypes from "prop-types";
import { FRAMESGIF } from "contants/framegif";
import { RadioButton } from "@shopify/polaris";
import { Col, Row } from "antd";

FramesGif.propTypes = {};

function FramesGif(props) {
  const {
    selectFrame,
    value,
    selectFrameUpload,
    handleChange,
    isAddmode,
    editedEvent,
    setValue,
    setSelectFrame,
    setSelectFrameUpload,
    setSelectFrameGif,
    grid,
  } = props;
  const checkFrameGif = (id) => {
    let res;
    if (editedEvent) {
      const str = editedEvent.frame_gif
        ? editedEvent.frame_gif.split(",")
        : null;
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

  const getValueFrameGif = () => {
    setValue("3");
    let radio = document.getElementsByName("framesGif");
    let result;
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) result = radio[i].id;
    }
    let ele = document.getElementsByName("frames");
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = false;
    }
    let ele2 = document.getElementsByName("framesUpload");
    for (let i = 0; i < ele2.length; i++) {
      ele2[i].checked = false;
    }
    setSelectFrame("");
    setSelectFrameUpload("");
    setSelectFrameGif(result);
    return result;
  };
  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {FRAMESGIF.map((frame, index) => (
          <Col className="gutter-row" span={grid} key={index}>
            <div className="AddEditEvent__imageFrame">
              <input
                type="radio"
                name="framesGif"
                id={frame.url}
                className="input-hidden"
                onChange={getValueFrameGif}
                defaultChecked={isAddmode ? false : checkFrameGif(frame.url)}
              />
              <label for={frame.url}>
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
  );
}

export default FramesGif;
