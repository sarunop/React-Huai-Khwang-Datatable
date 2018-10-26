const calculateTotalPage = (itemsCount, todosPerPage) => itemsCount / todosPerPage;
const pagination = (Items, currentPage = 1, todosPerPage = 10, totalPage = 1, storeItems) => {
    let listItems;
    let data;
    if (storeItems > 0) {
        listItems = calculatelistItemsWhenLoadFull(Items, currentPage, todosPerPage);
        let pageNumbers = countPageNumbers(totalPage);
        if (listItems.length == 0) {
            listItems = Items;
            data = {
                'listItems': listItems,
                'pageNumbers': pageNumbers
            }
        } else {
            data = {
                'listItems': listItems,
                'pageNumbers': pageNumbers
            }
        }
    }
    else {
        listItems = Items;
        countPageNumbers(totalPage);
        let pageNumbers = countPageNumbers(totalPage);
        data = {
            'listItems': listItems,
            'pageNumbers': pageNumbers
        }
    }
    return data;
}
const calculatelistItemsWhenLoadFull = (Items, currentPage, todosPerPage) => {
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    let listItems = Items.slice(indexOfFirstTodo, indexOfLastTodo);

    return listItems;
}
const countPageNumbers = (totalPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
}
const handleClickButtonPage = (pageClick, numberStartPara, todosPerPage, currentPagePara, totalNumberItemPara) => {
    if (pageClick == 0) {
        let numberStart = numberStartPara + Number(todosPerPage);
        let currentPage = currentPagePara + 1;
        let totalNumberProduct = Math.ceil(totalNumberItemPara);
        if (currentPage <= totalNumberProduct) {
            return { currentPage: currentPage, numberStart: numberStart };
        }
    }
    else if (pageClick == -1) {
        let numberStart = numberStartPara - Number(todosPerPage);
        let currentPage = currentPagePara - 1
        if (currentPage > 0) {
            return { currentPage: currentPage, numberStart: numberStart };
        }
    }
    else {
        let numberStart = (Number(pageClick) - 1) * Number(todosPerPage) + 1;
        return { currentPage: Number(pageClick), numberStart: Number(numberStart) };
    }
}
const checkPropsImportant = (props) => {
    let { pathApiGetTotalItem, pathApiGetItemAccordingPage, theadColumn, fields, primaryKey, search } = props
    if ((pathApiGetTotalItem != '' &&
        pathApiGetItemAccordingPage != '' &&
        theadColumn.length > 0 &&
        fields.length > 0 &&
        primaryKey != ''
    )
    ) {
        if ((theadColumn.length == fields.length)) {
            if (search.open) {
                if (search.pathApiGetItemAccordingPageAfterSearch != '' && search.pathApiGetTotalItemAfterSearch != '') {
                    return true;
                } else {
                    alert('กรุณาเพิ่ม pathApiGetItemAccordingPageAfterSearch pathApiGetTotalItemAfterSearch');
                    return false;
                }

            } else {
                return true;
            }
        } else {
            alert('กรุณาตั้งค่า pathApiGetItemAccordingPage theadColumn fields primaryKey ให้ครบ');
            return false;
        }

    } else {
        alert('กรุณาตั้งค่า pathApiGetItemAccordingPage theadColumn fields primaryKey ให้ครบ');
        return false;
    }
}
const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const mix = (source, target) => {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

export { pagination, handleClickButtonPage, calculateTotalPage, checkPropsImportant, isEmpty, mix }