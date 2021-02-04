import React from "react";
import PropTypes from "prop-types";
import { Tag } from "@shopify/polaris";
import { useSelector } from "react-redux";
import "./tag.scss";
TagFilter.propTypes = {};

function TagFilter(props) {
  const { filterEventTag } = props;
  const eventsSample = useSelector((state) => state.eventsSample);
  const getValueCheckboxImage = () => {
    let checkbox = document.getElementsByName("imageChoose");
    let result = "";
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        result += checkbox[i].value + ",";
      }
    }
    filterEventTag(result);
    return result;
  };
  return (
    <div className="tagFilter">
      <ul>
        {eventsSample
          .map((event, index) => (
            <li key={event.id} key={event.id}>
              <input
                type="checkbox"
                name="imageChoose"
                id={event.event_name}
                value={event.event_name}
                onChange={getValueCheckboxImage}
              />
              <label htmlFor={event.event_name} className="tagFilter__label" >
                <p>{event.event_name}</p>
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TagFilter;
