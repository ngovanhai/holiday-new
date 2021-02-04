import axiosClient from './axiosClient';
import { shop } from 'config'
const eventApi = {
    getAll: () => {
        const url = `?action=getEvents&shop=${shop}`;
        return axiosClient.get(url)
    },
    active: (id, active) => {
        const url = `?action=active&shop=${shop}&id=${id}&active=${active}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = ""
        return axiosClient.post(url, data)
    },
    update: (data) => {
        const url = ""
        return axiosClient.post(url, data)
    },
    remove: (id) => {
        const url = `?action=deleteEvent&shop=${shop}&id=${id}`
        return axiosClient.get(url)
    },
    Checkexpired: () => {
        const url = `?action=getShopInstall&shop=${shop}`
        return axiosClient.get(url)
    },
    getEvent: (id) => {
        const url = `?action=getEvent&shop=${shop}&id=${id}`
        return axiosClient.get(url)
    },
    check_expired: () => {
        const url = `?action=check_expired&shop=${shop}`
        return axiosClient.get(url)
    }, updateSample: (data) => {
        const url = ""
        return axiosClient.post(url, data)
    },
    getEventSample: () => {
        const url = `?action=getEventsSample&shop=${shop}`;
        return axiosClient.get(url)
    },
    deleteChooseEvents: (data) => {
        const url = '';
        return axiosClient.post(url, data)
    }

}

export default eventApi;