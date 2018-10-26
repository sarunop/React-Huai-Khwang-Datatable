import React, { Component } from 'react';
import Thead from './Thead.js';
import Tbody from './Tbody.js';
import PaginationList from './paginationList.js';

// import ProductExportExcel from '../../exportExcel/ProductExportExcel';
// import ProductExportPDF from '../../exportPDF/ProductExportPDF';

//library
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';

//library you
import { pagination, handleClickButtonPage, calculateTotalPage, checkPropsImportant } from './paginationFunc.js'
import { getApiGetTotalItem } from './getApiGetTotalItem.js';
import { getItemAccordingPage } from './getItemAccordingPage.js';
import { getItemAccordingPageAfterSearch } from './getItemAccordingPageAfterSearch.js';
import { getTotalItemAfterSearch } from './getTotalItemAfterSearch.js';

//css
import './table.scss';


class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            storeItems: [], // เก็บข้อมูลโปรดักที่โหลดมาทั้งหมด
            Items: [], // เก็บข้อมูลโปรดักที่ใช้ในการแสดงบนตาราง
            currentPage: 1, // หน้า page เริ่มต้น
            todosPerPage: 10, // จำนวน list รายการที่แสดงในแต่ละหน้า
            numberStart: 1, // เก็บค่าเริ่มต้นของลำดับในแต่ละหน้า
            totalPage: 0, // จำนวนหน้าทั้งหมด
            buttons: {
                buttonBack: false,
                buttonNext: false,
                open: false
            },
            search: {
                searchValue: '',
                oldSearchValue: '',
                show: true
            },
            nav: {
                EditItems: false,
            },
            //loading: true,
            // excel: {
            //     ExcelSheet: 'Product',
            //     thead: {
            //         column1: 'ลำดับ',
            //         column2: 'ชื่อสินค้า',
            //         column3: 'ประเภท',
            //         column4: 'ราคา'
            //     },
            //     show: false
            // },

        }
    }

    componentDidMount() {
        // console.log(this.props.settingTable)
        if (checkPropsImportant(this.props.settingTable)) {
            if (this.props.settingTable.selectTodosPerPage.open &&
                this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage &&
                this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage.length > 0) {
                this.setState({ todosPerPage: this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage[0] }
                    , () => {
                        this.getProduct();
                        this.getProductAccordingPage();
                    });
            } else {
                this.getProduct();
                this.getProductAccordingPage();
            }
        }
    }
    //get ข้อมูล product ทั้งหมด
    getProduct = () => {
        let defultParams = {
            params: { searchValue: this.state.search.searchValue }
        }
        //เช็คว่ามีค่าการค้นหาอยู่หรือไม่
        if (this.state.search.searchValue) {
            getTotalItemAfterSearch(this.props.settingTable.search.apiGetTotalItemAfterSearch, defultParams)
                .then(res => {
                    console.log(res)
                    if (res.data.Items.length > 0) {
                        this.setState({
                            storeItems: res.data.Items, Items: res.data.Items, numberStart: 1, currentPage: 1,
                            search: {
                                ...this.state.search,
                                oldSearchValue: this.state.search.searchValue
                            }
                        })
                    } else {
                        this.setState({ buttons: { ...this.state.buttons, open: false } });
                    }
                })
        } else {
            //get ค่าทั้งหมด
            getApiGetTotalItem(this.props.settingTable.apiGetTotalItem)
                .then(res => {
                    this.setState({ storeItems: res.data.Items, Items: res.data.Items })
                })
        }
    }

    //get ข้อมูล product ชั่วคราว
    getProductAccordingPage = () => {
        // เช็คว่ามีค่าการค้นหาอยู่หรือไม่
        if (this.state.search.searchValue) {
            // ยกเลิกค่า storeItems , Items เพื่อให้มีการเซ็ตค่าใหม่หลังมีการค้นหา
            this.setState({ storeItems: [], Items: [] })

            let defultParams = {
                params: { offset: 0, limit: this.state.todosPerPage, searchValue: this.state.search.searchValue }
            }
            getItemAccordingPageAfterSearch(this.props.settingTable.search.apiGetItemAccordingPageAfterSearch, defultParams)
                .then(res => {
                    if (res.data.Items.length > 0) {
                        let totalPage = calculateTotalPage(res.data.count, this.state.todosPerPage)
                        if (res.data.count > this.state.todosPerPage) {
                            this.setState({
                                Items: res.data.Items, totalPage: totalPage, numberStart: 1, currentPage: 1,
                                buttons: { ...this.state.buttons, buttonBack: false, buttonNext: true, open: true },
                                search: {
                                    ...this.state.search,
                                    oldSearchValue: this.state.search.searchValue
                                }
                            });
                        } else {
                            this.setState({
                                Items: res.data.Items, totalPage: totalPage, numberStart: 1, currentPage: 1,
                                buttons: { ...this.state.buttons, buttonBack: false, buttonNext: false },
                                search: {
                                    ...this.state.search,
                                    oldSearchValue: this.state.search.searchValue
                                }
                            });
                        }
                    } else {
                        this.setState({ buttons: { ...this.state.buttons, open: false } });
                    }

                })
        } else {
            let defultParams = {
                params: { offset: 0, limit: this.state.todosPerPage }
            }
            getItemAccordingPage(this.props.settingTable.apiGetItemAccordingPage, defultParams)
                .then(res => {
                    let totalPage = calculateTotalPage(res.data.count, this.state.todosPerPage)
                    if (res.data.count > this.state.todosPerPage) {
                        this.setState({
                            loading: false, Items: res.data.Items, totalPage: totalPage,
                            buttons: { ...this.state.buttons, buttonNext: true, open: true }
                        });
                    } else {
                        this.setState({
                            loading: false, Items: res.data.Items, totalPage: totalPage,
                            buttons: { ...this.state.buttons, buttonNext: false }
                        });
                    }
                })
        }
    }

    // event.target.id = หน้าเพจที่กด , 
    // limit จำนวนที่จะแสดงต่อหน้า ไม่ใช้ this.state.todosPerPage เพราะกรณีที่มีการเลือก limit ใหม่ this.state.todosPerPage จะยังไม่เปลี่ยนตามทันที
    clickButtonPage = (event, limit = this.state.todosPerPage) => {
        let pageClick = Number(event.target.id);

        //เช็คว่าโหลดข้อมูลทั้งหมดเสร็จหรือยัง
        if (this.state.storeItems.length != 0) {
            this.setState({ Items: [...this.state.storeItems] });

            //เซ็ตจำนวน link หน้า pagination ใหม่หลังจากการเลือก limit ใหม่
            let totalPage = calculateTotalPage(this.state.storeItems.length, limit);
            this.setState({ totalPage: totalPage });
            //handleClickButtonPage(ตัวเลข page ที่กด, ลำดับเริ่มต้นของหน้าก่อนหน้า , จำนวนข้อมูลต่อ 1 หน้า, หน้าปัจจุบัน, จำนวนสิ้นค้าทั้งหมด)
            const result = handleClickButtonPage(pageClick, this.state.numberStart, limit, this.state.currentPage, this.state.totalPage)
            this.setState(result);

            let buttonBack = this.checkStatusButtonBack(result);
            this.checkStatusButtonNext(result, buttonBack, totalPage)

        } else {
            this.setState({ loading: true });
            // offset = หน้าเพจ - 1 * จำนวนที่ต้องการแสดงในหนึ่งหน้า
            let offset = (pageClick - 1) * limit;

            let defultParams = { params: { offset: offset, limit: limit } }


            getItemAccordingPage(this.props.settingTable.apiGetItemAccordingPage, defultParams)
                .then(res => {
                    let totalPage = res.data.count / limit;
                    this.setState({ loading: false, Items: res.data.Items, totalPage: totalPage, buttons: { ...this.state.buttons, buttonNext: true } });

                    return totalPage;
                })
                .then((totalPage) => {
                    // handleClickButtonPage(ตัวเลข page ที่กด, ลำดับเริ่มต้นของหน้าก่อนหน้า , จำนวนข้อมูลต่อ 1 หน้า, หน้าปัจจุบัน, จำนวนสิ้นค้าทั้งหมด)
                    const result = handleClickButtonPage(pageClick, this.state.numberStart, limit, this.state.currentPage, this.state.totalPage)
                    this.setState(result);

                    let buttonBack = this.checkStatusButtonBack(result);
                    this.checkStatusButtonNext(result, buttonBack, totalPage);
                    this.setState({ loading: false });
                })
        }
    }

    //เช็คสถานะปุ่มย้อนกลับ หลังกดเปลี่ยนหน้าข้อมูล
    checkStatusButtonBack = result => {
        let buttons = {};
        if (result.currentPage == 1) {
            buttons = { ...this.state.buttons, buttonBack: false }
            this.setState({ buttons: buttons });
        } else {
            buttons = { ...this.state.buttons, buttonBack: true }
            this.setState({ buttons: buttons });
        }
        return buttons;
    }

    //เช็คสถานะปุ่มถัดไป หลังกดเปลี่ยนหน้าข้อมูล
    checkStatusButtonNext = (result, buttonBack, totalPage) => {
        if (result.currentPage == Math.ceil(totalPage)) {
            this.setState({ buttons: { ...buttonBack, buttonNext: false } });
        } else {
            this.setState({ buttons: { ...buttonBack, buttonNext: true } });
        }
    }

    //เปลี่ยนจำนวนการแสดงรายการ
    todosPerPageChange = event => {
        this.setState({ todosPerPage: event.target.value });
        let page = { target: { id: 1 } };
        this.clickButtonPage(page, Number(event.target.value));
    }

    //ลบข้อมูล
    deleteProduct = id => {

        swal({
            title: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.title,
            text: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.text,
            icon: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.icon,
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let setId = { id: id }
                    axios.post(this.props.settingTable.buttonDelete.apiDelete, setId)
                        .then(res => {
                            let Items = [...this.state.Items]
                            Items.forEach((element, index) => {
                                if (element.id == res.data.input) { Items.splice(index, 1); }
                            });
                            return Items;
                        })
                        .then(Items => {
                            this.setState({ Items: Items });
                            //pagination( จำนวนข้อมูล , หน้าเริ่มต้น , จำนวนข้อมูลต่อ 1 หน้า )
                            let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage);
                            if (Pagination.listItems.length == 0) {
                                let result = handleClickButtonPage(-1, this.state.numberStart, this.state.todosPerPage, this.state.currentPage, this.state.totalNumberProduct)
                                this.setState(result);
                            }
                        })
                }
            });
    }

    //แก้ไขข้อมูลโดยการดับเบิ้ลคลิ๊ก
    editDoubleClick = idProduct => {
        this.props.history.push({ pathname: this.props.settingTable.buttonEdit.pathName, state: { "primaryKey": idProduct } });
    }

    //ค้นหา
    searchChange = (event) => {
        this.setState({ search: { ...this.state.search, searchValue: event.target.value } });
    }

    //คลิ๊กค้นหา
    searchClick = () => {
        if (this.state.search.searchValue != this.state.search.oldSearchValue) {
            this.getProduct();
            this.getProductAccordingPage();
        }

    }

    listItems = () => {
        let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage, this.state.totalPage, this.state.storeItems.length);
        return Pagination.listItems && Pagination.listItems.map((Item, index) => {
            return (
                <tr key={Item.id} className="trDataItem" onDoubleClick={() => { this.editDoubleClick(Item.id) }}>
                    <td>{this.state.numberStart + index}</td>

                    <Tbody
                        Item={Item}
                        Fields={this.props.settingTable.fields}
                        fieldsPrimaryKey={this.props.settingTable.primaryKey}
                        buttonEdit={this.props.settingTable.buttonEdit}
                        buttonDelete={this.props.settingTable.buttonDelete}
                        funcDelete={this.deleteProduct}
                    />
                </tr>
            )
        })
    }

    renderPageNumbers = () => {

        let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage, this.state.totalPage, this.state.storeItems.length);
        let numback = false;
        let numNext = false;


        return Pagination.pageNumbers.map((number, index) => {
            let backCurrentPage = this.state.currentPage - 2;
            let nextCurrentPage = this.state.currentPage + 2;


            return (
                <PaginationList key={index}
                    numback={numback}
                    numNext={numNext}
                    backCurrentPage={backCurrentPage}
                    nextCurrentPage={nextCurrentPage}
                    number={number}
                    currentPage={this.state.currentPage}
                    onClickButtonPage={this.clickButtonPage} />
            )
        });
    }

    renderSelectTodosPerPage = () => {
        if (this.props.settingTable.selectTodosPerPage.open) {
            let listSelectTodosPerPage = [];
            if (this.props.settingTable.selectTodosPerPage.open &&
                this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage &&
                this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage.length > 0) {
                listSelectTodosPerPage = this.props.settingTable.selectTodosPerPage.listSelectTodosPerPage
            } else {
                listSelectTodosPerPage = ['10', '20', '50', '100'];
            }
            return listSelectTodosPerPage.map((SelectTodosPerPage, index) => {
                return (<option key={index} value={SelectTodosPerPage}>{SelectTodosPerPage}</option>)
            })
        }
    }



    render() {

        return (

            <div className="row">
                <div id="coverTabOnTopTable" className="col-md-12">
                    <div className="row">
                        {this.props.settingTable.selectTodosPerPage.open &&
                            <div id="coverTodosPerPage" className="col-md-1">
                                <select id="todosPerPage" className="form-control" onChange={this.todosPerPageChange}>
                                    {this.renderSelectTodosPerPage()}

                                </select>
                            </div>}

                        {this.props.settingTable.search.open &&
                            <div className="col-md-4 form-inline">
                                <div className="form-group mb-2">
                                    <label className="sr-only">ค้นหา</label>
                                    <input type="text" className="form-control" placeholder="ค้นหา" value={this.state.search.searchValue} onChange={this.searchChange} />
                                </div>
                                <button type="button" className="btn btn-primary mb-2" onClick={this.searchClick}>ค้นหา</button>
                            </div>}
                    </div>
                </div>

                <table id="table">
                    <thead>
                        <tr>
                            <Thead theadColumn={this.props.settingTable.theadColumn}
                                buttonEdit={this.props.settingTable.buttonEdit}
                                buttonDelete={this.props.settingTable.buttonDelete} />
                        </tr>
                    </thead>
                    <tbody>
                        {this.listItems()}
                    </tbody>
                </table>
                <div id="pagination">
                    {this.state.buttons.open && <button id='-1' className="btn btn-light btnBack" onClick={this.clickButtonPage} disabled={this.state.buttons.buttonBack == false}>ย้อนกลับ</button>}
                    {this.renderPageNumbers()}
                    {this.state.buttons.open && <button id='0' className="btn btn-light btnNext" onClick={this.clickButtonPage} disabled={this.state.buttons.buttonNext == false} >ถัดไป {this.state.buttons.buttonNext}</button>}
                </div>
            </div>
        )
    }
}

export default withRouter(Table);