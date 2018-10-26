import React, { Component } from 'react';
import Table from '../table';

class Page extends Component {

    constructor(props) {
        super(props)

        this.state = {

            /*
                ข้อมุลที่จำเป็นต้องมี
                pathApiGetTotalItem
                pathApiGetItemAccordingPage
                theadColumn
                fields
                primaryKey

                ถ้า search.open เป็น true ต้องมี search.apiGetItemAccordingPageAfterSearch.path
                ถ้า buttonEdit.open เป็น true ต้องมี buttonEdit.pathName buttonEdit.IconEdit
                ถ้า buttonDelete.open เป็น true ต้องมี buttonDelete.IconDelete buttonDelete.path buttonDelete.settingDialogConfrimDelete
            */
            settingTable: {
                apiGetTotalItem: {
                    path: "", // path api ที่ใช้ยิงค่า item ทั้งหมด ex path: "http://xxx.xxx.xx.xx:8000/api/getProductAccordingPage"
                    headers: {}, // header (ถ้ามี) { 'Authorization': xxxxxxxx, 'Accept': 'xxxxxxx' }
                    method: "get", // method default get
                    // data: {  }// data (ถ้ามี) ex { 'test': 'test' }
                },
                apiGetItemAccordingPage: {
                    path: "", // path api ที่ใช้ยิงค่า item เฉพาะหน้านั้นๆ ex path: "http://xxx.xxx.xx.xx:8000/api/getProductAccordingPage"
                    headers: {}, // header (ถ้ามี) { 'Authorization': xxxxxxxx, 'Accept': 'xxxxxxx' }
                    method: "get", // method default get
                    // data: {}// data (ถ้ามี) data: { 'test': 'test' }// data (ถ้ามี) ex { 'test': 'test' }
                },
                theadColumn: ['ชื่อสินค้า', 'ประเภท', 'ราคา'], // thead Column (theadColumn และ tfootColumn.column ต้องมีจำนวนเท่ากับ fields)
                tfootColumn: {
                    open: true, //เปิด , ปิดการใช้
                    column: [] // thead column (theadColumn และ tfootColumn.column ต้องมีจำนวนเท่ากับ fields) ex ['ชื่อสินค้า', 'ประเภท', 'ราคา'] 
                },
                fields: [], // ชื่อ fields ที่จะแสดง ex ['product_categories_name', 'product_name', 'product_price']
                primaryKey: 'id', // ชื่อ fields primaryKey เพื่อเอามาใช้ในเปิดหน้า edit หรือลบข้อมูล
                search: {
                    open: true, // เปิดใช้การค้นหา
                    apiGetItemAccordingPageAfterSearch: {
                        path: "", // path api ที่ใช้ยิงค่าค้นหา item เฉพาะหน้านั้นๆ ex path: "http://xxx.xxx.xx.xx:8000/api/searchProductAccordingPage"
                        headers: {}, // header (ถ้ามี) { 'Authorization': xxxxxxxx, 'Accept': 'xxxxxxx' }
                        method: "get", // method default get
                        // data: { }// data (ถ้ามี) ex { 'test': 'test' }
                    },
                    apiGetTotalItemAfterSearch: {
                        path: "", // path api ที่ใช้ยิงค่าค้นหา item ทั้งหมด ex path: "http://xxx.xxx.xx.xx:8000/api/searchProduct"
                        headers: {}, // header (ถ้ามี) { 'Authorization': xxxxxxxx, 'Accept': 'xxxxxxx' }
                        method: "get", // method default get
                        // data: {  }// data (ถ้ามี) ex { 'test': 'test' }
                    },
                },
                buttonEdit: {
                    open: true, // เปิดใช้ปุ่มเปิดหน้าแก้ไข
                    pathName: "", //path เปิดหน้าแก้ไข ex "/admin/products/editproduct"
                    IconEdit: "edit" // ชื่อ icon edit ที่จะใช้ (FontAwesomeIcon)
                },
                buttonDelete: {
                    open: true, // เปิดใช้ปุ่ม Delete Ex true/false
                    IconDelete: "trash-alt", // ชื่อ icon delete ที่จะใช้ (FontAwesomeIcon)
                    path: "", // path api ที่ใช้ในการลบ ex path: "http://xxx.xxx.xx.xx:8000/api/deleteProduct"
                    headers: {}, // header (ถ้ามี) { 'Authorization': xxxxxxxx, 'Accept': 'xxxxxxx' }
                    method: "post", // method default get
                    data: { 'test': 'test' },// data (ถ้ามี)
                    settingDialogConfrimDelete: { // setting DialogConfrimDelete (sweetalert)
                        title: "Are you sure?",
                        text: "Once deleted, you will not be able to recover this imaginary file!",
                        icon: "warning",
                    },
                },
                selectTodosPerPage: { // select เลือกจำนวน ที่จะแสดงในแต่ละหน้า
                    open: true, // เปิดใช้ Ex true/false
                    listSelectTodosPerPage: [] // select option Ex listSelectTodosPerPage: ['5', '10', '20', '50', '100']
                }
            }
        }
    }

    render() {
        return (
            <div id="coverTable">
                <Table settingTable={this.state.settingTable} />
            </div>
        )
    }
}
export default Page;






------------------------------------------------------------------------------------------------------------------------------------

สิ่งที่จำเป็นต้อง install 
1. npm i --save @fortawesome/react-fontawesome
2. npm install axios
3. npm install --save sweetalert
4. npm install --save react-router-dom
6. import 'bootstrap/dist/css/bootstrap.min.css';
7. npm install react-loader-spinner --save
8. เป็น scss ถ้าจะแก้เป็น css ก็ตามสะดวกเลย



เพื่อไม่ต้องรอให้การโหลดข้อมูลทั้งหมดเสร็จซึ้งอาจจะนาน
จึงให้โหลดข้อมูลมาแบบหน้าต่อหน้าก่อน และเปลี่ยนมาใช้ข้อมูลทั้งหมดเมื่อการโหลดข้อมูลทั้งหมดเสร็จสิ้น

----------------------------------------------------------------------------------------
