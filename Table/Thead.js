import React, { Component } from 'react';

class Thead extends Component {
    constructor(props) {
        super(props)
        // this.Thead = this.Thead.bind(this);
    }

    Thead = () => {
        let theadColumn = [...this.props.theadColumn];
        if (this.props.buttonEdit.open == true || this.props.buttonDelete.open == true) {
            theadColumn.push('');
        }

        theadColumn.unshift('No.');
        return theadColumn && theadColumn.map((column, index) => {
            return (<td key={index}>{column}</td>)
        })
    }

    render() {
        return (this.Thead());
    }
}
export default Thead;