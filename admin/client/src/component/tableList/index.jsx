import React, { useCallback, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Badge, Card, Frame, Page, Stack, Toast } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Dropdown, Button, Table } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ViewMajor } from "@shopify/polaris-icons";
import "./tablelist.scss";
import { ActiveRedux, RemoveEvent, RemoveEventChoose } from "store/eventSlice";
import Models from "component/model";
import { useHistory } from "react-router-dom";
import ModelEditEventSample from "component/modelEditEventSample";
import { shop } from "config";
import eventApi from "api/EventApi";
function TableList(props) {
  const {
    queryString,
    queryStatus,
    queryTag,
    filter,
    sort,
    changeHome,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [publish, setPublish] = useState();
  const [data, setData] = useState([]);
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [textButton, setTextButton] = useState("");
  const [content, setContent] = useState("");
  const [action, setAction] = useState("");
  const [contentToast, setContentToast] = useState("");
  const [activeModelSample, setActiveModelSample] = useState(false);
  const [editEventSample, setEditEventSample] = useState();
  const [showPreview, setShowPreview] = useState(true);
  const handleChangeModelSample = useCallback(
    () => setActiveModelSample(!activeModelSample),
    [activeModelSample]
  );

  let events = [];
  events = useSelector((state) => state.events);
  let eventsSample = useSelector((state) => state.eventsSample);
  events = events.map((event) => ({ key: event.id, ...event }));
  if (filter === "all") {
    events = events.filter((event) => +event.publish !== -1);
  } else if (filter === "active") {
    events = events.filter((event) => +event.publish === 1);
  } else if (filter === "disable") {
    events = events.filter((event) => +event.publish === 0);
  } else if (filter === "sample") {
    events = eventsSample;
  }
  const handleChange = useCallback(() => setActive(!active), [active]);
  if (filter !== "sample") {
    switch (sort[0]) {
      case "NameA-z":
        events = events.sort(function (a, b) {
          if (a < b) return -1;
          else if (a > b) return 1;
          return 0;
        });
        break;
      case "NameZ-a":
        events = events.sort((a, b) =>
          b.event_name.localeCompare(a.event_name)
        );
        break;
      case "Time-Start":
        events = events.sort((a, b) =>
          a.start_date.localeCompare(b.start_date)
        );
        break;
      case "Time-End":
        events = events.sort((a, b) => a.end_date.localeCompare(b.end_date));
        break;
      default:
        break;
    }
  } else {
    switch (sort[0]) {
      case "NameA-z":
        let dataAZ = [...events];
        dataAZ.sort((a, b) => a.event_name.localeCompare(b.event_name));
        events = dataAZ;
        break;
      case "NameZ-a":
        let dataZA = [...events];
        dataZA.reverse((a, b) => b.event_name.localeCompare(a.event_name));
        events = dataZA;
        break;
      case "Time-Start":
        eventsSample = events.sort((a, b) =>
          a.start_date.localeCompare(b.start_date)
        );
        break;
      case "Time-End":
        eventsSample = events.sort((a, b) =>
          a.end_date.localeCompare(b.end_date)
        );
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let newData = events.filter(
      (event) =>
        event.event_name
          .toLowerCase()
          .search(new RegExp(queryString.toLowerCase())) !== -1
    );
    setData(
      newData.map(function (item) {
        return { key: item[Object.keys(item)[0]], ...item };
      })
    );
  }, [queryString]);

  useEffect(() => {
    let dataTag = [];
    for (let i in queryStatus) {
      for (let j in events) {
        if (+queryStatus[i] === +events[j].publish) {
          dataTag.push(events[j]);
        }
      }
    }
    setData(
      dataTag.map(function (item) {
        return { key: item[Object.keys(item)[0]], ...item };
      })
    );
  }, [queryStatus]);

  const hanldeActive = () => {
    if (+publish === 0) {
      const eventActive = events.filter((event) => +event.publish === 1);
      if (eventActive.length === 1) {
        setTitle("Active Event ?");
        setContent(
          `Event ${eventActive[0].event_name} is runing you want stop event ?`
        );
        setAction("active");
        handleChange();
      } else {
        dispatch(ActiveRedux(id));
      }
    } else {
      dispatch(ActiveRedux(id));
    }
  };
  const handleEditEvent = () => {
    history.push("/holiday-effects/admin/client/build/addEdit/" + id);
  };
  const handleDeleteEvent = () => {
    setTitle("Delete Event ?");
    setContent(
      "Are you sure you want to delete this event ? This action cannot be undone "
    );
    setAction("delete");
    handleChange();
  };
  const handleCreateEventSample = (id) => {
    setEditEventSample(eventsSample.find((event) => event.idSample === id));
    handleChangeModelSample();
  };
  const onClickDelete = (id) => {
    const remove = async () => {
      const res = await eventApi.remove(id);
      if (res === "delete succsess") {
        dispatch(RemoveEvent(id));
        setContentToast("Delete event succes !");
        toggleActiveToast();
      }
    };
    remove();
    handleChange();
  };
  const onCliclActive = (id) => {
    dispatch(ActiveRedux(id));
    handleChange();
  };
  const handleCreateNewEvent = () => {
    history.push("/holiday-effects/admin/client/build/addEdit/");
  };
  const onClickdeleteChoose = async () => {
    const data = {
      id: selectedRowKeys,
      shop: shop,
      action: "deleteChooseEvents",
    };
    const res = await eventApi.deleteChooseEvents(data);
    if (res === "success !") {
      setContentToast("Delete events success");
      toggleActiveToast();
      dispatch(RemoveEventChoose(selectedRowKeys));
    } else {
      setContentToast("Delete events errors");
      toggleActiveToast();
    }
  };
  const handlePreview = (id) => {
    window.open(`http://${shop}?preview=${id}`);
  };
  const handlePreviewSample = (id) => {
    window.open(`http://${shop}?previewSample=${id}`);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={hanldeActive}>
        {+publish === 1 ? "Disable" : "Active"}
      </Menu.Item>
      <Menu.Item key="2" onClick={handleEditEvent}>
        Edit event
      </Menu.Item>
      <Menu.Item key="3" onClick={handleDeleteEvent}>
        Delete event
      </Menu.Item>
    </Menu>
  );

  let columns = [];
  if (filter !== "sample") {
    columns = [
      {
        title: "Event Name",
        dataIndex: "event_name",
      },
      {
        title: "Status",
        dataIndex: "publish",
        render: (text, record) =>
          +text === 0 ? (
            <div style={{ display: "flex" }} className="TableList__status">
              <ViewMajor
                className="TableList__icon"
                onClick={() => handlePreview(record.id)}
              />
              <p className="TableList__preview">Preview on Online Store</p>
              <Badge status="critical">Disable</Badge>
            </div>
          ) : (
              <div style={{ display: "flex" }} className="TableList__status">
                <ViewMajor
                  className="TableList__icon"
                  onClick={() => handlePreview(record.id)}
                />
                <p className="TableList__preview">
                  <Card>Preview on Online Store</Card>
                </p>
                <Badge status="success">Published</Badge>
              </div>
            ),
      },
      {
        title: "Start date",
        dataIndex: "start_date",
      },
      {
        title: "End date",
        dataIndex: "end_date",
      },
      {
        title: "Action",
        dataIndex: "id",

        render: (text, record) => (
          <div>
            <Dropdown overlay={menu}>
              <Button
                onMouseOver={() => {
                  setPublish(record.publish);
                  setId(text);
                }}
              >
                More action <DownOutlined />
              </Button>
            </Dropdown>
            <Models
              handleChange={handleChange}
              title={title}
              content={content}
              active={active}
              id={id}
              onClickDelete={
                action === "delete"
                  ? onClickDelete
                  : action === "active"
                    ? onCliclActive
                    : onClickdeleteChoose
              }
            />
          </div>
        ),
      },
    ];
  } else {
    columns = [
      {
        title: "Event Name",
        dataIndex: "event_name",
      },

      {
        title: "Preview",
        dataIndex: "idSample",
        render: (text) => (
          <div style={{ display: "flex" }} className="TableList__status">
            <ViewMajor
              className="TableList__icon"
              onClick={() => handlePreviewSample(text)}
            />
            <p className="TableList__preview">Preview on Online Store</p>
          </div>
        ),
      },

      {
        title: "Action",
        dataIndex: "idSample",
        render: (text, record) => (
          <div>
            <Button
              onClick={() => handleCreateEventSample(text)}
            >{`Create event ${record.event_name}`}</Button>
          </div>
        ),
      },
    ];
  }
  let onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Remove Event choose",
        onSelect: () => {
          const countEventActive = [];
          for (let i in selectedRowKeys) {
            const event = events.find(
              (event) => event.id === selectedRowKeys[i]
            );
            if (+event.publish === 1) {
              countEventActive.push(event);
            }
          }
          if (countEventActive.length === 1) {
            setTitle("delete selected events");
            setContent(
              `Event ${countEventActive[0].event_name} is runing you want delete event ?`
            );
            setAction("deleteSelected");
            handleChange();
          } else {
            setTitle("delete selected events");
            setContent(
              `Are you sure you want to delete selected events ? This action cannot be undone  ?`
            );
            setAction("deleteSelected");
            handleChange();
          }
        },
      },
    ],
  };
  const [activeToast, setActiveToast] = useState(false);

  const toggleActiveToast = useCallback(() => {
    setActiveToast((activeToast) => !activeToast);
  }, []);

  const toastMarkup = activeToast ? (
    <Toast content={contentToast} onDismiss={toggleActiveToast} />
  ) : null;

  return (
    <Frame>
      <div className="TableList">
        <Stack>
          <Button
            onClick={handleCreateNewEvent}
            className="TableList__btnCreate"
          >
            Create New Event
          </Button>
        </Stack>
        {filter !== "sample" ? (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.length === 0 ? events : data}
            scroll={{ x: 300 }}
          />
        ) : (
            <Table
              columns={columns}
              dataSource={data.length === 0 ? events : data}
              scroll={{ x: 300 }}
            />
          )}
        <ModelEditEventSample
          toggleActive={handleChangeModelSample}
          active={activeModelSample}
          editEventSample={editEventSample}
          isEditMode={true}
          setContentToast={setContentToast}
          toggleActiveToast={toggleActiveToast}
          changeHome={changeHome ? changeHome : null}
        />
        {toastMarkup}
      </div>
    </Frame>
  );
}

export default TableList;
