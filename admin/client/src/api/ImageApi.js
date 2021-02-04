import axiosClient from "./axiosClient";
import { shop } from "config";
const ImageApi = {
  getAll: () => {
    const url = `?action=getImage&shop=${shop}`;
    return axiosClient.get(url);
  },
  delete: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  deleteChooseImages: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  }
};
export default ImageApi;
