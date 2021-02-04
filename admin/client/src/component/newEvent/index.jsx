import React from "react";
import PropTypes from "prop-types";
import "./newEvent.scss";
import { useHistory } from "react-router-dom";
import {
  MobilePlusMajor
} from '@shopify/polaris-icons';

NewEvent.propTypes = {};

function NewEvent(props) {
  const history = useHistory();
  const handleCreate = () => {
    history.push("/holiday-effects/admin/client/build/addEdit")
  }
  return (
    <div className="newEvent">
      <div className="newEvent__create" onClick={handleCreate}>
        <MobilePlusMajor />
      </div>
    </div>
  );
}

export default NewEvent;
