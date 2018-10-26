import axios from "axios";
import { isEmpty, mix } from './paginationFunc.js'


const getItemAccordingPageCheckHeadersMethodData = (apiGetItemAccordingPage, defultParams) => {
    let headers = false
    let param = {};
    if (apiGetItemAccordingPage.headers) {
        let apiGetItemAccordingPageHeaders = apiGetItemAccordingPage.headers;
        // true = {}
        let objHeaders = isEmpty(apiGetItemAccordingPageHeaders);
        if (!objHeaders) {
            headers = true
        }
    }

    let method = '';
    (apiGetItemAccordingPage.method ? method = apiGetItemAccordingPage.method : method = 'get')

    let data = false
    if (apiGetItemAccordingPage.data) {

        let apiGetItemAccordingPageData = apiGetItemAccordingPage.data;
        // true = {}
        let objData = isEmpty(apiGetItemAccordingPageData);
        if (!objData) {
            data = true
            //รวมค่า data
            param = mix(apiGetItemAccordingPageData, defultParams.params)
        }
    }
    return { headers: headers, method: method, data: data, param: param }
}



const checkConditionApi = (checkHeadersMethodData, apiGetItemAccordingPage, defultParams) => {

    let apiGetItemAccordingPageHeaders = apiGetItemAccordingPage.headers;
    let apiGetItemAccordingPageData = apiGetItemAccordingPage.data;
    let params = {};
    if (checkHeadersMethodData.method == true) {
        params = {
            params: checkHeadersMethodData.param
        }
    } else {
        params = defultParams
    }

    if (checkHeadersMethodData.method == 'get') {
        //get headers=true
        if (checkHeadersMethodData.headers) {
            return axios.get(apiGetItemAccordingPage.path, params, { apiGetItemAccordingPageHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.get(apiGetItemAccordingPage.path, params)
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
            return axios.post(apiGetItemAccordingPage.path, apiGetItemAccordingPageData, { apiGetItemAccordingPageHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.post(apiGetItemAccordingPage.path, apiGetItemAccordingPageData)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    }
}

export const getItemAccordingPage = (apiGetItemAccordingPage, defultParams) => {
    let checkHeadersMethodData = getItemAccordingPageCheckHeadersMethodData(apiGetItemAccordingPage, defultParams)
    return checkConditionApi(checkHeadersMethodData, apiGetItemAccordingPage, defultParams);
}