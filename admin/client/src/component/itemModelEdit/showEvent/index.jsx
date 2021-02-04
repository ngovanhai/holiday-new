import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RadioButton, Stack, Checkbox, Heading } from "@shopify/polaris";

ShowEvent.propTypes = {};

function ShowEvent(props) {
  const { editedEvent, setValueOtherPage, setValueOnlyHome, vertical } = props;
  const [checkedAllpage, setCheckedAllpage] = useState(false);
  const [checkedHome, setCheckedHome] = useState(
    editedEvent
      ? +editedEvent.only_home === 1 ||
        editedEvent.other_page.search(new RegExp("allpage")) !== -1
        ? true
        : false
      : false
  );
  const [checkedProducts, setCheckedProducts] = useState(
    editedEvent
      ? editedEvent.other_page.search(new RegExp("products")) !== -1 ||
        editedEvent.other_page.search(new RegExp("allpage")) !== -1
        ? true
        : false
      : false
  );
  const [checkedCollections, setCheckedCollections] = useState(
    editedEvent
      ? editedEvent.other_page.search(new RegExp("collection")) !== -1 ||
        editedEvent.other_page.search(new RegExp("allpage")) !== -1
        ? true
        : false
      : false
  );
  const handleChangeAllPage = useCallback(
    (newValue) => {
      setCheckedAllpage(newValue);
      setCheckedHome(true);
      setCheckedProducts(true);
      setCheckedCollections(true);
    },

    []
  );
  const handleChangeHome = useCallback((newValue) => {
    setCheckedHome(newValue);
    setCheckedAllpage(false);
  }, []);
  const handleChangeProducts = useCallback((newValue) => {
    setCheckedProducts(newValue);
    setCheckedAllpage(false);
  }, []);
  const handleChangeCollections = useCallback((newValue) => {
    setCheckedCollections(newValue);
    setCheckedAllpage(false);
  }, []);
  let other_page;
  if (checkedProducts === true && checkedCollections === true) {
    other_page = "products,collection";
  } else if (checkedProducts === false && checkedCollections === true) {
    other_page = "collection";
  } else if (checkedProducts === true && checkedCollections === false) {
    other_page = "products";
  } else if (checkedAllpage === true) {
    other_page = "hahd";
    setValueOnlyHome(false);
  } else {
    other_page = "";
  }

  useEffect(() => {
    setValueOtherPage(other_page);
  }, [other_page]);

  useEffect(() => {
    setValueOnlyHome(checkedHome);
  }, [checkedHome]);
  useEffect(() => {
    if (checkedAllpage === true) {
      setValueOnlyHome(false);
      setValueOtherPage("allpage");
    }
  }, [checkedAllpage]);

  return (
    <div>
      {!vertical ? <p>Show event on page</p> : null}
      <Stack vertical={vertical}>
        <Checkbox
          label="All page"
          checked={checkedAllpage}
          onChange={handleChangeAllPage}
        />
        <Checkbox
          label="Home"
          checked={checkedHome}
          onChange={handleChangeHome}
        />
        <Checkbox
          label="Products"
          checked={checkedProducts}
          onChange={handleChangeProducts}
        />
        <Checkbox
          label="Collections"
          checked={checkedCollections}
          onChange={handleChangeCollections}
        />
      </Stack>
    </div>
  );
}

export default ShowEvent;
