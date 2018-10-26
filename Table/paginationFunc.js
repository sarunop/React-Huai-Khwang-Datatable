//คำนวนจำนวนหน้าใน link pagination
const calculateTotalPage = (itemsCount, todosPerPage) => itemsCount / todosPerPage;

// เซ็ตค่า listItems คือ object Item และ pageNumbers คือ array เลข page pagination
// รับค่า pagination( จำนวนข้อมูล , หน้าเริ่มต้น , จำนวนข้อมูลต่อ 1 หน้า )
const pagination = (Items, currentPage = 1, todosPerPage = 10, totalPage = 1, storeItems) => {
    let listItems;
    let data;
    //กรณีโหลดค่าทั้งหมดครบแล้ว
    if (storeItems > 0) {
        listItems = calculatelistItemsWhenLoadFull(Items, currentPage, todosPerPage);
        let pageNumbers = countPageNumbers(totalPage);

        //กรณีจังหวะกดเปลี่ยนหน้าระหว่างที่โลหดทั้งหมดเสร็จแล้วแต่ยังเซ็ตข้อมูลให้ Items ยังไม่เสร็จ
        if (listItems.length == 0) {
            //ให้ใช้ข้อมูลชั่วคราวไปก่อน
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
    //กรณีข้อมูลช่วงคราว
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
//คำนวนกรณีโหลดข้อมูลชุดใหญ่เสร็จแล้ว
const calculatelistItemsWhenLoadFull = (Items, currentPage, todosPerPage) => {
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    let listItems = Items.slice(indexOfFirstTodo, indexOfLastTodo);

    return listItems;
}
//คำนวน array เลข page pagination
const countPageNumbers = (totalPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
}

// หาว่าคลิ๊กที่ปุ่มไหนทั้งตัวแล้วและ ย้อนกลับ ต่อไป
const handleClickButtonPage = (pageClick, numberStartPara, todosPerPage, currentPagePara, totalNumberItemPara) => {
    //ถัดไป
    if (pageClick == 0) {
        let numberStart = numberStartPara + Number(todosPerPage);
        let currentPage = currentPagePara + 1;
        //ปัดเศษขึ้นเพื่อหน้าสุดท้ายเป็นเศษ
        let totalNumberProduct = Math.ceil(totalNumberItemPara);
        if (currentPage <= totalNumberProduct) {
            return { currentPage: currentPage, numberStart: numberStart };
        }
    }
    //ย้อนกลับ
    else if (pageClick == -1) {
        let numberStart = numberStartPara - Number(todosPerPage);
        let currentPage = currentPagePara - 1
        if (currentPage > 0) {
            return { currentPage: currentPage, numberStart: numberStart };
        }

    }
    //กดตัวเลข
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
        primaryKey != '') &&
        (theadColumn.length == fields.length)
    ) {
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