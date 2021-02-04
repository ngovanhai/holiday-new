import React, { useCallback, useEffect, useState } from "react";
import uploadApi from "api/UploadApi";
import { Table } from "antd";
import { CircleCancelMajor } from "@shopify/polaris-icons";
import { shop } from "config";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@shopify/polaris";
import Models from "component/model";
import {
  AddAllFrames,
  AddFrame,
  removeFrame,
  RemoveFramesChoose,
} from "store/framesSlice";
import { random } from "contants/function";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import "./uploadFrame.scss";
import { Frame, Toast } from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import FrameApi from "api/FrameApi";
UploadFrame.propTypes = {};

function UploadFrame(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [fileFrame, setFileFrame] = useState();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeToast, setActiveToast] = useState(false);
  const [contentToast, setContentToast] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [action, setAction] = useState();
  const toggleActive = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  const toastMarkup = activeToast ? (
    <Toast content={contentToast} onDismiss={toggleActive} />
  ) : null;
  const dispatch = useDispatch();
  const handleChange = useCallback(() => setActive(!active), [active]);
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const fetchData = async () => {
    const res = await uploadApi.getFrame();
    dispatch(AddAllFrames(res));
  };
  let FramesUpload = useSelector((state) => state.framesUpload);
  const events = useSelector((state) => state.events);
  FramesUpload = FramesUpload.map(function (item) {
    return { key: item.id, ...item };
  });

  useEffect(() => {
    if (FramesUpload.length === 0) {
      fetchData();
    }
  }, []);

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file || file.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (file.size > 500000) {
      setContentToast("Maximum photo size is 500 kb");
      setActiveToast(true);
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setContentToast("file fomat is incorrect");
      setActiveToast(true);
      return;
    }
    setFileFrame(file);
    setSelectedFile(file);
  };

  const getBase64 = (fileImage) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(fileImage);
      reader.onload = () => {
        baseURL = reader.result;
        baseURL = baseURL.split("data:image/jpeg;base64,").join("");
        baseURL = baseURL.split("data:image/png;base64,").join("");
        const base = {
          base: baseURL,
          name: fileImage.name,
        };
        resolve(base);
      };
    });
  };
  const handleUpload = () => {
    if (fileFrame) {
      getBase64(fileFrame)
        .then((result) => {
          const getid = async () => {
            const res = await uploadApi.getIdTheme();
            const theme = res.find((theme) => theme.role === "main");
            return theme.id;
          };
          getid()
            .then((id) => {
              const data = {
                ...result,
                idTheme: id,
              };
              return data;
            })
            .then((data) => {
              const dataFrame = {
                ...data,
                action: "uploadframe",
                shop: shop,
                id: random(),
              };
              const sendData = async () => {
                setLoading(true);
                const res = await uploadApi.uploadFrame(dataFrame);
                console.log(res);
                const data = {
                  name: res.name,
                  id: dataFrame.id,
                  shop: dataFrame.shop,
                  url: res.url,
                };
                dispatch(AddFrame(data));
                setSelectedFile(undefined);
                setLoading(false);
                setContentToast("Upload frame success !");
                setActiveToast(true);
              };
              sendData();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDelete = (id) => {
    const frameruning = FramesUpload.find((frame) => frame.id === id);
    const frameUse = events.filter(
      (frame) => frame.custom_frame === frameruning.url
    );
    if (frameUse.length !== 0) {
      setAction("deleteFrame");
      setIdDelete(id);
      setTitle("Delete Frame");
      setContent("This frame is in use . Do you want to delete ?");
      handleChange();
    } else {
      setAction("deleteFrame");
      setIdDelete(id);
      setTitle("Delete Frame");
      setContent(
        "Are you sure you want to delete this frame? This action cannot be undone"
      );
      handleChange();
    }
  };
  const DeleteFrames = (id) => {
    const Remove = async () => {
      setLoadingDelete(true);
      const getid = async () => {
        const res = await uploadApi.getIdTheme();
        const theme = res.find((theme) => theme.role === "main");
        return theme.id;
      };
      getid().then((idTheme) => {
        const dataDeleteFrame = {
          idTheme: idTheme,
          shop: shop,
          id: idDelete,
          action: "deleteFrame",
        };
        const deleteFrame = async () => {
          await uploadApi.deleteFrame(dataDeleteFrame);
          dispatch(removeFrame(idDelete));
          setContentToast("Delete frame succes");
          toggleActive();
        };
        deleteFrame();
        setLoadingDelete(false);
      });
    };
    Remove();
    handleChange();
  };

  const columns = [
    {
      title: "Images",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <div>
          <img src={text} alt="" className="uploadFrame__image" />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p className="">{text}</p>,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      render: (text) => (
        <div>
          <DeleteMajor
            className="uploadFrame__delete"
            onClick={() => handleDelete(text)}
          />
        </div>
      ),
    },
  ];
  const DeleteChooseFrames = async () => {
    setLoadingDelete(true);
    const getid = async () => {
      const res = await uploadApi.getIdTheme();
      const theme = res.find((theme) => theme.role === "main");
      return theme.id;
    };
    getid().then((idTheme) => {
      const dataDeleteFrames = {
        idTheme: idTheme,
        shop: shop,
        id: selectedRowKeys,
        action: "deleteChooseFrames",
      };
      const deleteFrames = async () => {
        await FrameApi.deleteChooseFrames(dataDeleteFrames);
        dispatch(RemoveFramesChoose(selectedRowKeys));
        setContentToast("Delete frames succes");
        toggleActive();
        setLoadingDelete(false);
        handleChange();
      };
      deleteFrames();
    });
  };
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
        text: "Remove frames selected",
        onSelect: () => {
          let count = 0;
          for (let i in selectedRowKeys) {
            const imageruning = FramesUpload.find(
              (frame) => frame.id === selectedRowKeys[i]
            );
            for (let i in events) {
              if (events[i].custom_frame !== "") {
                const imageExist = imageruning.url.includes(
                  events[i].custom_frame
                );
                if (imageExist === true) count++;
              }
            }
          }
          if (count !== 0) {
            setAction("deleteChooseFrame");
            setTitle("Delete frame");
            setContent("This frame is in use . Do you want to delete ?");
            handleChange();
          } else {
            setAction("deleteChooseFrame");
            setTitle("Delete frame");
            setContent(
              "Are you sure you want to delete frame selected? This action cannot be undone"
            );

            handleChange();
          }
        },
      },
    ],
  };
  return (
    <Frame>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="uploadFrame">
          <Table
            dataSource={FramesUpload}
            columns={columns}
            rowSelection={rowSelection}
          />
          <h1>Add New Frame</h1>
          <input type="file" name="uploadframe" onChange={onSelectFile} />
          {selectedFile && (
            <img src={preview} className="uploadFrame__imgPreview" />
          )}
          <img src="" alt="" />
          <p className="uploadFrame__note">Maximum image size is 500 kb</p>

          {loading ? (
            <Button onClick={handleUpload} loading fullWidth>
              Upload
            </Button>
          ) : (
              <Button onClick={handleUpload} fullWidth>
                Upload
              </Button>
            )}
        </div>
      </div>

      <Models
        handleChange={handleChange}
        title={title}
        content={content}
        active={active}
        id={action === "deleteFeame" ? idDelete : selectedRowKeys}
        onClickDelete={
          action === "deleteFrame" ? DeleteFrames : DeleteChooseFrames
        }
      />
      {toastMarkup}
    </Frame>
  );
}

export default UploadFrame;
