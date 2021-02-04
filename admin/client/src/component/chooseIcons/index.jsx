import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { createUseStyles } from "react-jss";
ChooseIcons.propTypes = {};

const useStyles = createUseStyles({
  ckeckbox: {
    "& .ant-checkbox-wrapper-checked": {
      color: (props) => props,
    },
    marginLeft: 50,
  },
});
function ChooseIcons(props) {
  const {
    OPTION_ICON,
    editedEvent,
    onClickChooseIcons,
    color,
    isAddmode,
  } = props;
  const [colorIcons, setColorIcons] = useState(color ? color : "black");
  let hideCheckbox = document.getElementsByName("iconsChoose");
  for (let i = 0; i < hideCheckbox.length; i++) {

  }
  function onChange() {
    setColorIcons(props.color);
    let checkbox = document.getElementsByName("iconsChoose");
    let result = [];
    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        result += checkbox[i].value + ",";
      }
    }
    onClickChooseIcons(result);
    return result;
  }
  const CheckIcon = () => {
    if (editedEvent) {
      return editedEvent.choose_icons.split(",");
    }
  };
  useEffect(() => {
    setColorIcons(color);
  }, [color]);

  const classes = useStyles(colorIcons);

  return (
    <div className="chooseIcons">
      <Checkbox.Group
        className={classes.ckeckbox}
        options={OPTION_ICON}
        defaultValue={isAddmode ? [] : CheckIcon}
        name="iconsChoose"
        onChange={onChange}
        id="hello"
      />
    </div>
  );
}

export default ChooseIcons;
