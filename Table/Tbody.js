import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Tbody extends Component {
    Tbody = () => {

        let { Item, Fields, fieldsPrimaryKey, buttonEdit, buttonDelete } = this.props;
        let fieldsKey = '';
        let td = [];
        for (const key in Item) {
            if (Fields.indexOf(key) != -1) {
                let index = Fields.indexOf(key)
                if (Item.hasOwnProperty(key)) {
                    td[index] = Item[key]
                    if (fieldsPrimaryKey && fieldsPrimaryKey == key) {
                        fieldsKey = Item[key];
                    }
                }
            }
            else if (fieldsPrimaryKey && fieldsPrimaryKey == key) {
                fieldsKey = Item[key];
            }
        }
        if (fieldsPrimaryKey) {
            td.push(fieldsKey);
        }
        return td.map((tdtext, index) => {
            if (td.length != index + 1) {
                return (<td className="pointer" key={index}>{tdtext}</td>)
            }
            else if (this.props.buttonEdit.open == true || this.props.buttonDelete.open == true) {
                return (<td key={index}>
                    {this.props.buttonEdit.open && <Link className="pointer" to={{ pathname: buttonEdit.pathName, state: { "primaryKey": tdtext } }}>
                        <FontAwesomeIcon icon={buttonEdit.IconEdit} size="1x" />
                    </Link>}
                    {this.props.buttonDelete.open && <FontAwesomeIcon className="pointer" onClick={() => { this.props.funcDelete(tdtext) }} icon={buttonDelete.IconDelete} size="1x" />}
                </td>)
            }
            else {
                return;
            }

        });
    }

    render() {
        return (this.Tbody());
    }
}
export default Tbody;