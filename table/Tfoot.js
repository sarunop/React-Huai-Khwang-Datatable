import React, { Component } from 'react';

class Tfoot extends Component {
    constructor(props) {
        super(props)
        // this.Thead = this.Thead.bind(this);
    }

    Thead = () => {
        let column = [...this.props.tfootColumn];
        if (this.props.buttonEdit.open == true || this.props.buttonDelete.open == true) {
            column.push('');
        }

        column.unshift('No.');
        return column && column.map((column, index) => {
            return (<td key={index}>{column}</td>)
        })
    }

    render() {
        return (this.Thead());
    }
}
export default Tfoot;