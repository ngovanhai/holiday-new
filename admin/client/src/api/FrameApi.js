import axiosClient from "./axiosClient";
import { shop } from "config";
const FrameApi = {
  getAll: () => {
    const url = `?action=getFrame&shop=${shop}`;
    return axiosClient.get(url);
  },
  delete: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  },
  deleteChooseFrames: (data) => {
    const url = "";
    return axiosClient.post(url, data);
  }
};
export default FrameApi;
