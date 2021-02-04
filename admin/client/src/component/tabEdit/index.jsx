import React, { useCallback, useState } from "react";
import { Card, Tabs } from "@shopify/polaris";
import ChooseIconss from "component/componentTabEdit/chooseIcons";
import ChooseFrame from "component/componentTabEdit/chooseFrame";
import ChooseFrameUpload from "component/componentTabEdit/chooseFrameUpload";
import ChooseBackground from "component/componentTabEdit/chooseBackground";
import ChooseImages from "component/componentTabEdit/chooseImages";

function TabEdit(props) {
  const {
    editedEvent,
    isAddmode,
    onClickChooseIcons,
    color,
    onClickChooseImages,
    onClickChooseImagesUpload,
    onClickChooseFrame,
    onClickChooseFrameUpload,
    onClickChooseFrameGif,
  } = props;

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  const tabs = [
    {
      id: "all-customers",
      content: "Choose icons",
      panelID: "all-customers-content",
      component: (
        <ChooseIconss
          onClickChooseIcons={onClickChooseIcons}
          color={color}
          isAddmode={isAddmode}
          editedEvent={editedEvent}
        />
      ),
    },
    {
      id: "accepts-marketing",
      content: "Choose images",
      panelID: "accepts-marketing-content",
      component: (
        <ChooseImages
          isAddmode={isAddmode}
          editedEvent={editedEvent}
          onClickChooseImages={onClickChooseImages}
          onClickChooseImagesUpload={onClickChooseImagesUpload}
        />
      ),
    },
    {
      id: "repeat-customers",
      content: "Choose frames",
      panelID: "repeat-customers-content",
      component: <ChooseFrameUpload />,
    },
    {
      id: "prospects",
      content: "Choose background",
      panelID: "prospects-content",
      component: <ChooseBackground />,
    },
  ];

  return (
    <Card>
      <Tabs
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
        disclosureText={false}
      >
        <Card.Section title={tabs[selected].component}></Card.Section>
      </Tabs>
    </Card>
  );
}

export default TabEdit;
