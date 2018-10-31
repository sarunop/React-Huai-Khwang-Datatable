import axios from "axios";
import { isEmpty, mix } from './PaginationFunc.js'

const getItemAccordingPageAfterSearchCheckHeadersMethodData = (apiGetItemAccordingPageAfterSearch, defultParams) => {
    let headers = false
    let param = {};
    if (apiGetItemAccordingPageAfterSearch.headers) {
        let apiGetItemAccordingPageAfterSearchHeaders = apiGetItemAccordingPageAfterSearch.headers;
        // true = {}
        let objHeaders = isEmpty(apiGetItemAccordingPageAfterSearchHeaders);
        if (!objHeaders) {
            headers = true
        }
    }

    let method = '';
    (apiGetItemAccordingPageAfterSearch.method ? method = apiGetItemAccordingPageAfterSearch.method : method = 'get')

    let data = false
    if (apiGetItemAccordingPageAfterSearch.data) {
        let apiGetItemAccordingPageAfterSearchData = apiGetItemAccordingPageAfterSearch.data;
        // true = {}
        let objData = isEmpty(apiGetItemAccordingPageAfterSearchData);
        if (!objData) {
            data = true
            param = mix(apiGetItemAccordingPageAfterSearchData, defultParams.params)
        }
    }
    return { headers: headers, method: method, data: data, param: param }
}




const checkConditionApi = (checkHeadersMethodData, apiGetItemAccordingPageAfterSearch, defultParams) => {

    let apiGetItemAccordingPageAfterSearchHeaders = apiGetItemAccordingPageAfterSearch.headers;
    let apiGetItemAccordingPageAfterSearchData = apiGetItemAccordingPageAfterSearch.data;
    let params = {};
    if (checkHeadersMethodData.method == true) {
        params = {
            params: checkHeadersMethodData.param
        }
    } else {
        params = defultParams
    }
    let headers = { headers: apiGetItemAccordingPageAfterSearchHeaders }
    if (checkHeadersMethodData.method == 'get') {
        //get headers=true
        if (checkHeadersMethodData.headers) {
            let config = {
                headers: apiGetItemAccordingPageAfterSearchHeaders,
                params: params.params
            }
            return axios.get(apiGetItemAccordingPageAfterSearch.path, config)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.get(apiGetItemAccordingPageAfterSearch.path, params)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    } else {
        //post headers=true
        if (checkHeadersMethodData.headers) {
            return axios.post(apiGetItemAccordingPageAfterSearch.path, apiGetItemAccordingPageAfterSearchData, headers)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.post(apiGetItemAccordingPageAfterSearch.path, apiGetItemAccordingPageAfterSearchData)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    }
}

export const getItemAccordingPageAfterSearch = (apiGetItemAccordingPageAfterSearch, defultParams) => {
    let checkHeadersMethodData = getItemAccordingPageAfterSearchCheckHeadersMethodData(apiGetItemAccordingPageAfterSearch, defultParams)
    return checkConditionApi(checkHeadersMethodData, apiGetItemAccordingPageAfterSearch, defultParams);
}