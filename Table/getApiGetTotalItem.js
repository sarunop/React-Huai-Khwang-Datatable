import axios from "axios";
import { isEmpty } from './paginationFunc.js'
const getApiGetTotalItemCheckHeadersMethodData = (apiGetTotalItem) => {
    let headers = false
    if (apiGetTotalItem.headers) {
        let apiGetTotalItemHeaders = apiGetTotalItem.headers;
        let objHeaders = isEmpty(apiGetTotalItemHeaders);
        if (!objHeaders) {
            headers = true
        }
    }
    let method = '';
    (apiGetTotalItem.method ? method = apiGetTotalItem.method : method = 'get')

    let data = false
    if (apiGetTotalItem.data) {
        let apiGetTotalItemData = apiGetTotalItem.data;
        let objData = isEmpty(apiGetTotalItemData);
        if (!objData) {
            data = true
        }
    }
    return { headers: headers, method: method, data: data }
}

const checkConditionApi = (checkHeadersMethodData, apiGetTotalItem) => {
    let apiGetTotalItemHeaders = apiGetTotalItem.headers;
    let apiGetTotalItemData = apiGetTotalItem.data;
    let params = {
        params: apiGetTotalItemData
    }
    if (checkHeadersMethodData.method == 'get') {
        if (checkHeadersMethodData.headers) {
            if (checkHeadersMethodData.data) {
                return axios.get(apiGetTotalItem.path, params, { headers: apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            else {
                return axios.get(apiGetTotalItem.path, {}, { headers: apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
        else {
            if (checkHeadersMethodData.data) {
                return axios.get(apiGetTotalItem.path, params)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            else {
                return axios.get(apiGetTotalItem.path)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
    } else {
        if (checkHeadersMethodData.headers) {
            if (checkHeadersMethodData.data) {
                return axios.post(apiGetTotalItem.path, apiGetTotalItemData, { headers: apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            else {
                return axios.post(apiGetTotalItem.path, {}, { headers: apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
        else {
            if (checkHeadersMethodData.data) {
                return axios.post(apiGetTotalItem.path, apiGetTotalItemData)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            else {
                return axios.post(apiGetTotalItem.path)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
    }
}

export const getApiGetTotalItem = (apiGetTotalItem) => {
    let checkHeadersMethodData = getApiGetTotalItemCheckHeadersMethodData(apiGetTotalItem)
    return checkConditionApi(checkHeadersMethodData, apiGetTotalItem);
}
