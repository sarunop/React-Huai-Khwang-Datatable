import axios from "axios";
import { isEmpty, mix } from './paginationFunc.js'
const getTotalItemAfterSearchCheckHeadersMethodData = (apigetTotalItemAfterSearch, defultParams) => {
    let headers = false
    let param = {};
    if (apigetTotalItemAfterSearch.headers) {
        let apigetTotalItemAfterSearchHeaders = apigetTotalItemAfterSearch.headers;
        let objHeaders = isEmpty(apigetTotalItemAfterSearchHeaders);
        if (!objHeaders) {
            headers = true
        }
    }
    let method = '';
    (apigetTotalItemAfterSearch.method ? method = apigetTotalItemAfterSearch.method : method = 'get')
    let data = false
    if (apigetTotalItemAfterSearch.data) {
        let apigetTotalItemAfterSearchData = apigetTotalItemAfterSearch.data;
        let objData = isEmpty(apigetTotalItemAfterSearchData);
        if (!objData) {
            data = true
            param = mix(apigetTotalItemAfterSearchData, defultParams.params)
        }
    }
    return { headers: headers, method: method, data: data, param: param }
}
const checkConditionApi = (checkHeadersMethodData, apigetTotalItemAfterSearch, defultParams) => {
    let apigetTotalItemAfterSearchHeaders = apigetTotalItemAfterSearch.headers;
    let apigetTotalItemAfterSearchData = apigetTotalItemAfterSearch.data;
    let params = {};
    if (checkHeadersMethodData.method == true) {
        params = {
            params: checkHeadersMethodData.param
        }
    } else {
        params = defultParams
    }
    if (checkHeadersMethodData.method == 'get') {
        if (checkHeadersMethodData.headers) {
            return axios.get(apigetTotalItemAfterSearch.path, params, { headers: apigetTotalItemAfterSearchHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        else {
            return axios.get(apigetTotalItemAfterSearch.path, params)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    } else {
        if (checkHeadersMethodData.headers) {
            return axios.post(apigetTotalItemAfterSearch.path, apigetTotalItemAfterSearchData, { headers: apigetTotalItemAfterSearchHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        else {
            return axios.post(apigetTotalItemAfterSearch.path, apigetTotalItemAfterSearchData)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    }
}

export const getTotalItemAfterSearch = (apigetTotalItemAfterSearch, defultParams) => {
    let checkHeadersMethodData = getTotalItemAfterSearchCheckHeadersMethodData(apigetTotalItemAfterSearch, defultParams)
    return checkConditionApi(checkHeadersMethodData, apigetTotalItemAfterSearch, defultParams);
}