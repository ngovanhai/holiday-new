import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import moment from "moment";

TimeEnd.propTypes = {
  setTimeStartEffect: PropTypes.func,
  editEventSample: PropTypes.object,
};

function TimeEnd(props) {
  const { editEventSample, setTimeEndEffect, isEditMode } = props;
  const hanleTimeEnd = useCallback((date, dateString) => {
    setTimeEndEffect(dateString);
  }, []);
  return (
    <DatePicker
      className="AddEditEvent__datepicker"
      format="YYYY-MM-DD HH:mm:ss"
      defaultValue=""
      onChange={hanleTimeEnd}
      showTime
    />
  );
}

export default TimeEnd;
