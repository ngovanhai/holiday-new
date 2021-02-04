import React, { useCallback, useEffect, useState } from "react";
import { Button, Frame, Scrollable, Toast } from "@shopify/polaris";
import { random } from "contants/function";
import uploadApi from "api/UploadApi";
import backgroundApi from "api/BackgroundApi";
import { shop } from "config";
import { useDispatch, useSelector } from "react-redux";
import { AddBackground } from "store/backgroundSlice";
import { Col, Row } from "antd";
import { CircleCancelMajor } from "@shopify/polaris-icons";
import "./background.scss";

function UploadBackground(props) {
  const { editedEvent, isAddmode, setBackgroundUpload } = props;
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [fileImage, setFileImage] = useState();
  const [Loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [activeToast, setActiveToast] = useState(false);
  const [contentToast, setContentToast] = useState("");
  const [backgrounds, setBackgrounds] = useState();
  const toggleActive = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  const dispatch = useDispatch();
  const toastMarkup = activeToast ? (
    <Toast content={contentToast} onDismiss={toggleActive} />
  ) : null;
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  useEffect(() => {
    const fetcData = async () => {
      const res = await backgroundApi.getAll();
      setBackgrounds(res);
    }
    fetcData();
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
                action: "uploadBackground",
                shop: shop,
                id: random(),
              };
              const sendData = async () => {
                setLoading(true);
                const res = await uploadApi.upBackground(dataImage);
                return res;
              };
              sendData().then((res) => {
                const data = {
                  name: res.name,
                  id: dataImage.id,
                  shop: dataImage.shop,
                  url: res.url,
                };
                setBackgrounds([...backgrounds, data]);
                setSelectedFile(undefined);
                setLoading(false);
                setContentToast("Upload Image success !");
                setActiveToast(true);
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getValueBackgroundUpload = () => {
    let radio = document.getElementsByName("backgroundUpload");
    let result;
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) result = radio[i].id;
    }
    setBackgroundUpload(result);
    return result;
  };
  const checkBackgroundUpload = (id) => {
    let res;
    if (editedEvent) {
      const str = editedEvent.custom_frame.split(",");
      for (let url in str) {
        if (str[url] === id) {
          res = true;
          break;
        } else {
          res = false;
        }
      }
    }
    return res;
  };

  const handleRemoveBackground = (background) => {
    const Remove = async () => {
      setLoadingDelete(true);
      const getid = async () => {
        const res = await uploadApi.getIdTheme();
        const theme = res.find((theme) => theme.role === "main");
        return theme.id;
      };
      getid().then((idTheme) => {
        const dataDeleteBackground = {
          idTheme: idTheme,
          shop: shop,
          id: background.id,
          name: background.name,
          action: "deleteBackground",
        };
        const deleteBackground = async () => {
          await backgroundApi.delete(dataDeleteBackground);
        };

        deleteBackground().then(() => {
          setBackgrounds(backgrounds.filter((x) => x.name !== background.name));
          setContentToast("Delete image success");
          setActiveToast(true);
        });
        setLoadingDelete(false);
      });
    };
    Remove();
  };
  return (
    <div className="background">
      <Scrollable shadow style={{ height: "300px" }}>
        <input
          type="file"
          name="uploadimage"
          onChange={onSelectFile}
          className="background__input"
        />
        {selectedFile && (
          <img
            src={preview}
            className="uploadImage__imgPreview background__preview"
            alt=""
          />
        )}
        {Loading ? (
          <Button onClick={handleUpload} loading fullWidth>
            Upload
          </Button>
        ) : (
            <Button onClick={handleUpload} fullWidth>
              Upload
            </Button>
          )}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {backgrounds
            ? backgrounds.map((background, index) => (
              <Col className="gutter-row" span={6} key={index}>
                <div className="AddEditEvent__imageFrame" key={background.id}>
                  <input
                    type="radio"
                    name="backgroundUpload"
                    id={background.url}
                    className="input-hidden"
                    onClick={getValueBackgroundUpload}
                    defaultChecked={
                      isAddmode
                        ? false
                        : checkBackgroundUpload(background.url)
                    }
                  />
                  <label for={background.url}>
                    <img
                      src={background.url}
                      className="AddEditEvent__Frameimg"
                      alt=""
                    />
                  </label>
                  <span
                    className="background__remove"
                    onClick={() => handleRemoveBackground(background)}
                  >
                    <CircleCancelMajor />
                  </span>
                </div>
              </Col>
            ))
            : null}
        </Row>
      </Scrollable>
    </div>
  );
}

export default UploadBackground;
