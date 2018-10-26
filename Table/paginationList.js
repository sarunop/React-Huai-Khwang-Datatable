import React, { Component } from 'react';

class PaginationList extends Component {

    pagination() {

        // console.log(this.props.paginationList)
        let { backCurrentPage, nextCurrentPage, number, currentPage, numback,
            numNext, onClickButtonPage } = this.props

        if (number >= backCurrentPage && number <= nextCurrentPage) {
            return (
                <li key={number}
                    id={number}
                    onClick={(e) => { onClickButtonPage(e) }}
                    className={(currentPage == number ? 'btn btn-dark' : 'btn btn-light btnBack')}
                >
                    {number}
                </li >
            );
        }
        else if (number < backCurrentPage) {
            if (numback == false) {
                numback = true;
                return (<button key={number} type="button" className='btn btn-light btnBack' disabled> ... </button>);
            }
        }
        else {
            if (numNext == false) {
                numNext = true;
                return (<button key={number} type="button" className='btn btn-light btnBack' disabled> ... </button>);
            }
        }
    }

    render() {
        return (this.pagination());
    }
}
export default PaginationList;