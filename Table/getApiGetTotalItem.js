import axios from "axios";
import { isEmpty } from './paginationFunc.js'


const getApiGetTotalItemCheckHeadersMethodData = (apiGetTotalItem) => {
    let headers = false
    if (apiGetTotalItem.headers) {
        let apiGetTotalItemHeaders = apiGetTotalItem.headers;
        // true = {}
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
        // true = {}
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
        //get headers=true
        if (checkHeadersMethodData.headers) {
            //get headers=true data=true
            if (checkHeadersMethodData.data) {
                return axios.get(apiGetTotalItem.path, params, { apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            //get headers=true data=false 
            else {
                return axios.get(apiGetTotalItem.path, {}, { apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
        //get headers=false
        else {
            //get headers=false data=true
            if (checkHeadersMethodData.data) {
                return axios.get(apiGetTotalItem.path, params)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            //get headers=false data=false
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
        //post headers=true
        if (checkHeadersMethodData.headers) {
            //get headers=true data=true
            if (checkHeadersMethodData.data) {
                return axios.post(apiGetTotalItem.path, apiGetTotalItemData, { apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            //get headers=true data=false 
            else {
                return axios.post(apiGetTotalItem.path, {}, { apiGetTotalItemHeaders })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
        }
        //get headers=false
        else {
            //get headers=false data=true
            if (checkHeadersMethodData.data) {
                return axios.post(apiGetTotalItem.path, apiGetTotalItemData)
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return err
                    })
            }
            //get headers=false data=false
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
