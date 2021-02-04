import React, { useCallback, useState } from "react";

import { Card, Tabs } from "@shopify/polaris";


import "./createdEvent.scss";

import TableHome from "component/table";

CreateEvent.propTypes = {};

function CreateEvent(props) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  const changeHome = () => {
    setSelected(0);
  };
  const tabs = [
    {
      id: "all-events",
      content: "Event Created",
      accessibilityLabel: "All customers",
      component: <TableHome filter={"all"} />,
    },
    {
      id: "sample-event",
      content: "Sample Events",
      component: <TableHome filter={"sample"} changeHome={changeHome} />,
    },
  ];
  return (
    <div>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card title={tabs[selected].component}></Card>
        </Tabs>
      </Card>
    </div>
  );
}

export default CreateEvent;
