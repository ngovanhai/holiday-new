import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import UploadApi from "api/UploadApi";
import "./uploadImage.scss";
import { Table } from "antd";
import { CircleCancelMajor } from "@shopify/polaris-icons";
import { shop } from "config";
import { useDispatch, useSelector } from "react-redux";
import { Button, Toast, Frame } from "@shopify/polaris";
import Models from "component/model";
import {
  AddAllImages,
  AddImage,
  RemoveImage,
  RemoveImagesChoose,
} from "store/imagesSlice";
import { random } from "contants/function";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import { DeleteMajor } from "@shopify/polaris-icons";
import uploadApi from "api/UploadApi";
import ImageApi from "api/ImageApi";
UploadImages.propTypes = {};

function UploadImages(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [fileImage, setFileImage] = useState();
  const [Loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
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

  let data = useSelector((state) => state.imagesUpload);
  const events = useSelector((state) => state.events);
  data = data.map(function (item) {
    return { key: item.id, ...item };
  });

  useEffect(() => {
    const fetchData = async () => {
      if (data.length === 0) {
        const res = await uploadApi.getImage();
        dispatch(AddAllImages(res));
      }
    };
    fetchData();
  }, []);
  const onSelectFile = (e) => {
    const file = e.target.files[0];

    if (!file || file.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    if (file.size > 1000000) {
      setContentToast("Maximum photo size is 500 kb");
      setActiveToast(true);
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setContentToast("file fomat is incorrect");
      setActiveToast(true);
      return;
    }

    setFileImage(file);
    setSelectedFile(file);
  };
  const getBase64 = (image) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        baseURL = reader.result;
        baseURL = baseURL.split("data:image/jpeg;base64,").join("");
        baseURL = baseURL.split("data:image/png;base64,").join("");
        const base = {
          base: baseURL,
          name: image.name,
        };
        resolve(base);
      };
    });
  };
  const handleUpload = () => {
    if (fileImage) {
      getBase64(fileImage)
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
              const dataImage = {
                ...data,
                action: "uploadImage",
                shop: shop,
                id: random(),
              };
              const sendData = async () => {
                setLoading(true);
                const res = await uploadApi.uploadFrame(dataImage);
                console.log(res);
                const data = {
                  name: res.name,
                  id: dataImage.id,
                  shop: dataImage.shop,
                  url: res.url,
                };
                dispatch(AddImage(data));
                setSelectedFile(undefined);
                setLoading(false);
                setContentToast("Upload Image success !");
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
    const imageruning = data.find((image) => image.id === id);
    const imageUse = events.filter(
      (event) => event.custom_images === imageruning.url
    );
    if (imageUse.length !== 0) {
      setAction("deleteImage");
      setIdDelete(id);
      setTitle("Delete Image");
      setContent("This image is in use do you want to delete it ?");
      handleChange();
    } else {
      setAction("deleteImage");
      setIdDelete(id);
      setTitle("Delete Image");
      setContent(
        "Are you sure you want to delete this image? This action cannot be undone"
      );
      handleChange();
    }
  };
  const DeleteImages = (id) => {
    const Remove = async () => {
      setLoadingDelete(true);
      const getid = async () => {
        const res = await uploadApi.getIdTheme();
        const theme = res.find((theme) => theme.role === "main");
        return theme.id;
      };
      getid().then((idTheme) => {
        const dataDeleteImages = {
          idTheme: idTheme,
          shop: shop,
          id: idDelete,
          action: "deleteImage",
        };
        const deleteImage = async () => {
          await uploadApi.deleteImage(dataDeleteImages);
          dispatch(RemoveImage(id));
          setContentToast("Delete image succes")
          toggleActive()
        };
        deleteImage();
      });
      setContentToast("Delete image success ")
      toggleActive()
      setLoadingDelete(false);
    };
    Remove();
    handleChange();
  };
  const DeleteChooseImages = async () => {
    setLoadingDelete(true);
    const getid = async () => {
      const res = await uploadApi.getIdTheme();
      const theme = res.find((theme) => theme.role === "main");
      return theme.id;
    };
    getid().then((idTheme) => {
      const dataDeleteImages = {
        idTheme: idTheme,
        shop: shop,
        id: selectedRowKeys,
        action: "deleteChooseImages",
      };
      const deleteImage = async () => {
        await ImageApi.deleteChooseImages(dataDeleteImages);
        dispatch(RemoveImagesChoose(selectedRowKeys));
        setLoadingDelete(false);
        setContentToast("Delete images success");
        toggleActive();
        handleChange();
      };
      deleteImage();
    });
  };
  const columns = [
    {
      title: "Images",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <img src={text} alt="" className="uploadImage__image" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "id",
      fixed: "right",
      key: "id",
      render: (text) => (
        <div>
          <DeleteMajor
            onClick={() => handleDelete(text)}
            className="uploadImage__delete"
          />
        </div>
      ),
    },
  ];
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
        text: "Remove Images selected",
        onSelect: () => {
          let count = 0;
          for (let i in selectedRowKeys) {
            const imageruning = data.find(
              (image) => image.id === selectedRowKeys[i]
            );
            for (let i in events) {
              if (events[i].custom_images !== "") {
                const imageExist = imageruning.url.includes(
                  events[i].custom_images
                );
                if (imageExist === true) count++;
              }
            }
          }
          if (count !== 0) {
            setAction("deleteChooseImage");
            setTitle("Delete Image");
            setContent("This image is in use . Do you want to delete ?");
            handleChange();
          } else {
            setAction("deleteChooseImage");
            setTitle("Delete Image");
            setContent(
              "Are you sure you want to delete image selected? This action cannot be undone"
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
        <div className="uploadImage">
          <Table
            dataSource={data}
            columns={columns}
            rowSelection={rowSelection}
          />
          <h1>Add New Image</h1>
          <input type="file" name="uploadimage" onChange={onSelectFile} />
          {selectedFile && (
            <img src={preview} className="uploadImage__imgPreview" alt="" />
          )}
          <br />
          <span className="uploadImage__note">
            Maximum image size is 500 kb
          </span>
          <br />
          {Loading ? (
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
        id={action === "deleteImage" ? idDelete : selectedRowKeys}
        onClickDelete={
          action === "deleteImage" ? DeleteImages : DeleteChooseImages
        }
      />
      {toastMarkup}
    </Frame>
  );
}

export default UploadImages;
