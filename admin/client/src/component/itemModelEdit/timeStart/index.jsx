import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import moment from "moment";
TimeStart.propTypes = {};

function TimeStart(props) {
  const { editEventSample, setTimeStartEffect, isEditMode } = props;
  const hanleTimeStart = useCallback((date, dateString) => {
    setTimeStartEffect(dateString);
  }, []);
  return (
    <DatePicker
      className="AddEditEvent__datepicker"
      format="YYYY-MM-DD HH:mm:ss"
      defaultValue={moment()}
      onChange={hanleTimeStart}
      showTime
    />
  );
}

export default TimeStart;
