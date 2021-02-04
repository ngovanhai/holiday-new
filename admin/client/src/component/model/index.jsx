import React from "react";
import PropTypes from "prop-types";
import { Modal, TextContainer } from "@shopify/polaris";

Models.propTypes = {};

function Models(props) {
  const {
    handleChange,
    title,
    textButton,
    active,
    id,
    onClickDelete,
    onActive,
    content,
  } = props;
  const handleDelete = () => {
    onClickDelete(id);
  };
  const handleActive = () => {
    onActive(id);
  };
  return (
    <Modal
      open={active}
      onClose={handleChange}
      title={title}
      primaryAction={{
        content: textButton ? textButton : "Agree",
        onAction: handleDelete ? handleDelete : handleActive,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>{content}</p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}

export default Models;
