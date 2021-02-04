import React from "react";
import PropTypes from "prop-types";
import { AppProvider, ContextualSaveBar, Frame } from "@shopify/polaris";
import { Card } from "@material-ui/core";
SaveBar.propTypes = {};

function SaveBar(props) {
  const {
    onSave,
    onHomeCancel,
    onEditCancel,
    onSaveEdit,
    isAddmode,
    Loading,
  } = props;
  const handleSave = () => {
    if (onSave) onSave();
  };
  const handleEdit = () => {
    if (onSaveEdit) onSaveEdit();
  };
  return (
    <div style={{ height: "0px" }}>
      <AppProvider
        i18n={{
          Polaris: {
            ContextualSaveBar: {
              save: isAddmode ? "Save" : "Edit",
              discard: "Cancel",
            },
          },
        }}
      >
        <Frame>
          <ContextualSaveBar
            saveAction={{
              onAction: isAddmode ? handleSave : handleEdit,
              loading: Loading,
              disabled: false,
            }}
            discardAction={{
              onAction: isAddmode ? onHomeCancel : onEditCancel,
            }}
          />
        </Frame>
      </AppProvider>
    </div>
  );
}

export default SaveBar;
