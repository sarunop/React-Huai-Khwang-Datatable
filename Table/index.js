import React, { Component } from 'react';
import Thead from './Thead.js';
import Tbody from './Tbody.js';
import Tfoot from './Tfoot.js';
import PaginationList from './PaginationList.js';

// import ProductExportExcel from '../../exportExcel/ProductExportExcel';
// import ProductExportPDF from '../../exportPDF/ProductExportPDF';

//library
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';

//library you
import { pagination, handleClickButtonPage, calculateTotalPage, checkPropsImportant } from './PaginationFunc.js'
import { getApiGetTotalItem } from './GetApiGetTotalItem.js';
import { getItemAccordingPage } from './GetItemAccordingPage.js';
import { getItemAccordingPageAfterSearch } from './GetItemAccordingPageAfterSearch.js';
import { getTotalItemAfterSearch } from './GetTotalItemAfterSearch.js';
import { buttonDelete } from './ButtonDelete.js';
import Loading from '../../Loading';


//css
import './Table.scss';

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
            openThead: false,
            openTfoot: false,
            loading: true,
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
                    // console.log(res)
                    if (res.data.Items.length > 0) {
                        this.setState({
                            openThead: true,
                            openTfoot: true,
                            loading: false,
                            storeItems: res.data.Items, Items: res.data.Items, numberStart: 1, currentPage: 1,
                            search: {
                                ...this.state.search,
                                oldSearchValue: this.state.search.searchValue
                            }
                        })
                    } else {
                        this.setState({ loading: false, buttons: { ...this.state.buttons, open: false } });
                    }
                })
        } else {
            //get ค่าทั้งหมด
            getApiGetTotalItem(this.props.settingTable.apiGetTotalItem)
                .then(res => {
                    this.setState({ openThead: true, openTfoot: true, loading: false, storeItems: res.data.Items, Items: res.data.Items, openThead: true, openTfoot: true })
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
                                openThead: true,
                                openTfoot: true,
                                loading: false,
                                Items: res.data.Items, totalPage: totalPage, numberStart: 1, currentPage: 1,
                                buttons: { ...this.state.buttons, buttonBack: false, buttonNext: true, open: true },
                                search: {
                                    ...this.state.search,
                                    oldSearchValue: this.state.search.searchValue
                                }
                            });
                        } else {
                            this.setState({
                                openThead: true,
                                openTfoot: true,
                                loading: false,
                                Items: res.data.Items, totalPage: totalPage, numberStart: 1, currentPage: 1,
                                buttons: { ...this.state.buttons, buttonBack: false, buttonNext: false },
                                search: {
                                    ...this.state.search,
                                    oldSearchValue: this.state.search.searchValue
                                }
                            });
                        }
                    } else {
                        this.setState({
                            openThead: true, openTfoot: true, loading: false, buttons: { ...this.state.buttons, open: false }
                        });
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
                            openThead: true,
                            openTfoot: true,
                            loading: false,
                            Items: res.data.Items, totalPage: totalPage,
                            buttons: { ...this.state.buttons, buttonNext: true, open: true }
                        });
                    } else {
                        this.setState({
                            openThead: true,
                            openTfoot: true,
                            loading: false,
                            Items: res.data.Items, totalPage: totalPage,
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

            // offset = หน้าเพจ - 1 * จำนวนที่ต้องการแสดงในหนึ่งหน้า
            let offset = (pageClick - 1) * limit;

            let defultParams = { params: { offset: offset, limit: limit } }


            getItemAccordingPage(this.props.settingTable.apiGetItemAccordingPage, defultParams)
                .then(res => {
                    let totalPage = res.data.count / limit;
                    this.setState({ Items: res.data.Items, totalPage: totalPage, buttons: { ...this.state.buttons, buttonNext: true } });

                    return totalPage;
                })
                .then((totalPage) => {
                    // handleClickButtonPage(ตัวเลข page ที่กด, ลำดับเริ่มต้นของหน้าก่อนหน้า , จำนวนข้อมูลต่อ 1 หน้า, หน้าปัจจุบัน, จำนวนสิ้นค้าทั้งหมด)
                    const result = handleClickButtonPage(pageClick, this.state.numberStart, limit, this.state.currentPage, this.state.totalPage)
                    this.setState(result);

                    let buttonBack = this.checkStatusButtonBack(result);
                    this.checkStatusButtonNext(result, buttonBack, totalPage);

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
    deleteShop = id => {

        swal({
            title: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.title,
            text: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.text,
            icon: this.props.settingTable.buttonDelete.settingDialogConfrimDelete.icon,
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    let defultParams = {
                        params: { id: id }
                    }

                    buttonDelete(this.props.settingTable.buttonDelete, defultParams)
                        .then(res => {

                            if (this.props.onClickDelete != undefined) {
                                let onDelete = this.props.onClickDelete(res)
                                if (onDelete) {
                                    let Items = [...this.state.Items]
                                    Items.forEach((element, index) => {
                                        for (const key in element) {
                                            if (element.hasOwnProperty(key)) {
                                                if (key == this.props.settingTable.primaryKey) {
                                                    if (element[key] == res.data.input) { Items.splice(index, 1); }
                                                }
                                            }
                                        }
                                    });
                                    return Items;
                                } else {
                                    swal("ไม่สำเร็จ", "ลบข้อมูลไม่สำเร็จ", "error")
                                    let Items = [...this.state.Items]
                                    return Items;
                                }
                            } else {

                                let Items = [...this.state.Items]
                                Items.forEach((element, index) => {
                                    for (const key in element) {
                                        if (element.hasOwnProperty(key)) {
                                            if (key == this.props.settingTable.primaryKey) {
                                                if (element[key] == res.data.input) {
                                                    Items.splice(index, 1);
                                                }
                                            }
                                        }
                                    }
                                });
                                return Items;
                            }
                        })
                        .then(Items => {

                            this.setState({ Items: Items, storeItems: Items }, () => {

                                //pagination( จำนวนข้อมูล , หน้าเริ่มต้น , จำนวนข้อมูลต่อ 1 หน้า )
                                let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage);
                                if (Pagination.listItems.length == 0) {
                                    let result = handleClickButtonPage(-1, this.state.numberStart, this.state.todosPerPage, this.state.currentPage, this.state.totalNumberProduct)
                                    this.setState(result);
                                }
                            });
                        })
                }
            });
    }

    //แก้ไขข้อมูลโดยการดับเบิ้ลคลิ๊ก
    editDoubleClick = Item => {
        for (const key in Item) {
            if (Item.hasOwnProperty(key)) {
                if (key == this.props.settingTable.primaryKey) {
                    this.props.history.push({ pathname: this.props.settingTable.buttonEdit.pathName, state: { "primaryKey": Item[key] } });
                }
            }
        }
    }

    //ค้นหา
    searchChange = (event) => {
        this.setState({ search: { ...this.state.search, searchValue: event.target.value } });
    }

    //คลิ๊กค้นหา
    searchClick = () => {
        if (this.state.search.searchValue != this.state.search.oldSearchValue) {
            this.setState({ loading: true, openThead: false, openTfoot: false })
            this.getProduct();
            this.getProductAccordingPage();
        }

    }

    listItems = () => {
        let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage, this.state.totalPage, this.state.storeItems.length);

        return Pagination.listItems && Pagination.listItems.map((Item, index) => {
            return (
                <tr key={index} className="trDataItem" onDoubleClick={() => { this.editDoubleClick(Item) }}>
                    <td>{this.state.numberStart + index}</td>

                    <Tbody
                        Item={Item}
                        Fields={this.props.settingTable.fields}
                        fieldsPrimaryKey={this.props.settingTable.primaryKey}
                        buttonEdit={this.props.settingTable.buttonEdit}
                        buttonDelete={this.props.settingTable.buttonDelete}
                        funcDelete={this.deleteShop}
                    />
                </tr>
            )
        })
    }




    renderPageNumbers = () => {

        let Pagination = pagination(this.state.Items, this.state.currentPage, this.state.todosPerPage, this.state.totalPage, this.state.storeItems.length);
        return <PaginationList
            Pagination={Pagination}
            currentPage={this.state.currentPage}
            onClickButtonPage={this.clickButtonPage} />
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
            <div >
                {!this.state.loading &&
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
                                    {this.state.openThead &&
                                        <Thead theadColumn={this.props.settingTable.theadColumn}
                                            buttonEdit={this.props.settingTable.buttonEdit}
                                            buttonDelete={this.props.settingTable.buttonDelete} />}
                                </tr>
                            </thead>
                            <tbody>
                                {this.listItems()}
                            </tbody>
                            <tfoot>
                                <tr>
                                    {this.props.settingTable.tfootColumn.open && this.state.openThead &&
                                        <Tfoot tfootColumn={this.props.settingTable.tfootColumn.column}
                                            buttonEdit={this.props.settingTable.buttonEdit}
                                            buttonDelete={this.props.settingTable.buttonDelete} />}
                                </tr>
                            </tfoot>
                        </table>
                        <div id="pagination">
                            {this.state.buttons.open && <button id='-1' className="btn btn-light btnBack" onClick={this.clickButtonPage} disabled={this.state.buttons.buttonBack == false}>ย้อนกลับ</button>}
                            {this.renderPageNumbers()}
                            {this.state.buttons.open && <button id='0' className="btn btn-light btnNext" onClick={this.clickButtonPage} disabled={this.state.buttons.buttonNext == false} >ถัดไป {this.state.buttons.buttonNext}</button>}
                        </div>



                    </div>
                }
                {this.state.loading && <Loading />}
                {/* {this.state.loading &&
                    <div className="Loader">
                        <Loader type="Circles" color="#05b97f" height="100" width="100" />
                    </div>
                } */}
            </div >
        )
    }
}

export default withRouter(Table);