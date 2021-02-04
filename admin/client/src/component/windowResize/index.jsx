import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

useWindowSize.propTypes = {};

function useWindowSize(props) {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [windowSize, setWindowSize] = useState(getSize());
  useEffect(() => {
    const resizeHandler = () => setWindowSize(getSize());
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  });
  return windowSize;
}

export default useWindowSize;
