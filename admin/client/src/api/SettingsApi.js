import axiosClient from "./axiosClient";
import { shop } from "config";
const SettingApi = {
  getAll: () => {
    const url = `?action=getSettings&shop=${shop}`;
    return axiosClient.get(url);
  },
  activeTurnOff: (active) => {
    const url = `?action=settingsturnOnOff&shop=${shop}&active=${active}`;
    return axiosClient.get(url);
  },
  activeAutoPublish: (active) => {
    const url = `?action=settingsAuoPublish&shop=${shop}&active=${active}`;
    return axiosClient.get(url);
  },
};
export default SettingApi;
