import React, { Component } from 'react';
import Thead from './Thead.js';
import Tbody from './Tbody.js';
import Tfoot from './Tfoot.js';
import PaginationList from './paginationList.js';
import { withRouter } from "react-router-dom";
import swal from 'sweetalert';
import { pagination, handleClickButtonPage, calculateTotalPage, checkPropsImportant } from './paginationFunc.js'
import { getApiGetTotalItem } from './getApiGetTotalItem.js';
import { getItemAccordingPage } from './getItemAccordingPage.js';
import { getItemAccordingPageAfterSearch } from './getItemAccordingPageAfterSearch.js';
import { getTotalItemAfterSearch } from './getTotalItemAfterSearch.js';
import { buttonDelete } from './buttonDelete.js';
import Loader from 'react-loader-spinner';
import './table.scss';

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            storeItems: [],
            Items: [],
            currentPage: 1,
            todosPerPage: 10,
            numberStart: 1,
            totalPage: 0,
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
    getProduct = () => {
        let defultParams = {
            params: { searchValue: this.state.search.searchValue }
        }
        if (this.state.search.searchValue) {
            getTotalItemAfterSearch(this.props.settingTable.search.apiGetTotalItemAfterSearch, defultParams)
                .then(res => {
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
                        this.setState({ buttons: { ...this.state.buttons, open: false } });
                    }
                })
        } else {
            getApiGetTotalItem(this.props.settingTable.apiGetTotalItem)
                .then(res => {
                    this.setState({ loading: false, storeItems: res.data.Items, Items: res.data.Items, openThead: true, openTfoot: true })
                })
        }
    }
    getProductAccordingPage = () => {
        if (this.state.search.searchValue) {
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
    clickButtonPage = (event, limit = this.state.todosPerPage) => {
        let pageClick = Number(event.target.id);
        if (this.state.storeItems.length != 0) {
            this.setState({ Items: [...this.state.storeItems] });
            let totalPage = calculateTotalPage(this.state.storeItems.length, limit);
            this.setState({ totalPage: totalPage });
            const result = handleClickButtonPage(pageClick, this.state.numberStart, limit, this.state.currentPage, this.state.totalPage)
            this.setState(result);
            let buttonBack = this.checkStatusButtonBack(result);
            this.checkStatusButtonNext(result, buttonBack, totalPage)
        } else {
            let offset = (pageClick - 1) * limit;
            let defultParams = { params: { offset: offset, limit: limit } }
            getItemAccordingPage(this.props.settingTable.apiGetItemAccordingPage, defultParams)
                .then(res => {
                    let totalPage = res.data.count / limit;
                    this.setState({ Items: res.data.Items, totalPage: totalPage, buttons: { ...this.state.buttons, buttonNext: true } });
                    return totalPage;
                })
                .then((totalPage) => {
                    const result = handleClickButtonPage(pageClick, this.state.numberStart, limit, this.state.currentPage, this.state.totalPage)
                    this.setState(result);
                    let buttonBack = this.checkStatusButtonBack(result);
                    this.checkStatusButtonNext(result, buttonBack, totalPage);
                })
        }
    }
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
    checkStatusButtonNext = (result, buttonBack, totalPage) => {
        if (result.currentPage == Math.ceil(totalPage)) {
            this.setState({ buttons: { ...buttonBack, buttonNext: false } });
        } else {
            this.setState({ buttons: { ...buttonBack, buttonNext: true } });
        }
    }
    todosPerPageChange = event => {
        this.setState({ todosPerPage: event.target.value });
        let page = { target: { id: 1 } };
        this.clickButtonPage(page, Number(event.target.value));
    }
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
                    let defultParams = {
                        params: { id: id }
                    }
                    buttonDelete(this.props.settingTable.buttonDelete, defultParams)
                        .then(res => {
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
    editDoubleClick = idProduct => {
        this.props.history.push({ pathname: this.props.settingTable.buttonEdit.pathName, state: { "primaryKey": idProduct } });
    }
    searchChange = (event) => {
        this.setState({ search: { ...this.state.search, searchValue: event.target.value } });
    }
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
                {this.state.loading &&
                    <div className="Loader">
                        <Loader type="Circles" color="#05b97f" height="100" width="100" />
                    </div>
                }
            </div >
        )
    }
}

export default withRouter(Table);