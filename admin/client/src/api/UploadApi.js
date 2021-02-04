import axiosClient from "./axiosClient";
import { shop } from "config";

const uploadApi = {
  uploadFrame: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  uploadImage: (data) => {
    const url = "";
    return axiosClient.post(url, data, {});
  },
  upBackground: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  background: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  deleteImage: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  deleteFrame: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  getImage: () => {
    const url = `?action=getImage&shop=${shop}`;
    return axiosClient.get(url);
  },
  getFrame: () => {
    const url = `?action=getFrame&shop=${shop}`;
    return axiosClient.get(url);
  },
  getIdTheme: () => {
    const url = `?action=getIdTheme&shop=${shop}`;
    return axiosClient.get(url);
  },
};

export default uploadApi;
