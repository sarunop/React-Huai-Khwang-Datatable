import axios from "axios";
import { isEmpty, mix } from './paginationFunc.js'







const buttonDeleteCheckHeadersMethodData = (apiGetItemAccordingPage, defultParams) => {
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




const checkConditionApi = (checkHeadersMethodData, buttonDelete, defultParams) => {

    let buttonDeleteHeaders = buttonDelete.headers;
    let buttonDeleteData = buttonDelete.data;
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
            return axios.get(buttonDelete.path, params, { headers: buttonDeleteHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.get(buttonDelete.path, params)
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
            console.log('params')
            console.log(params)
            console.log(buttonDeleteHeaders)
            console.log(checkHeadersMethodData)
            return axios.post(buttonDelete.path, params.params, { headers: buttonDeleteHeaders })
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
        //get headers=false
        else {
            return axios.post(buttonDelete.path, params.params)
                .then(res => {
                    return res
                })
                .catch(err => {
                    return err
                })
        }
    }
}




export const buttonDelete = (buttonDelete, defultParams) => {
    let checkHeadersMethodData = buttonDeleteCheckHeadersMethodData(buttonDelete, defultParams);
    return checkConditionApi(checkHeadersMethodData, buttonDelete, defultParams);
}