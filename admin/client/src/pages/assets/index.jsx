import { Card, Layout, Tabs } from "@shopify/polaris";
import UploadFrame from "component/uploadFrames";
import UploadImages from "component/uploadImages";
import React, { useCallback, useState } from "react";

function Assets(props) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: 'all-customers',
      content: 'Manager images',
      accessibilityLabel: 'All customers',
      component: <UploadImages />
    },
    {
      id: 'accepts-marketing',
      content: 'Manager frames',
      component: <UploadFrame />
    },

  ];
  return <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      <Card.Section title={tabs[selected].component}>
      </Card.Section>
    </Tabs>
  </Card>;
}

export default Assets;
