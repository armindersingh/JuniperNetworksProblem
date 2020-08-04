import React, { Component, Fragment } from 'react';
import './AirportChooser.css';
import utilsSingletonObject from './Utils/utils.js';

const AirportInformation = (props) => {
    return (
        <tbody className={props.highlightedRow ? 'highlightedRow' : 'notHighlightedRow'}><tr>
            <td>{props.airportInfoObj.name ? props.airportInfoObj.name : <span className="notAvailableEntry">Entry not available</span>}</td>
            <td>{props.airportInfoObj.code ? props.airportInfoObj.code : <span className="notAvailableEntry">Entry not available</span>}</td>
            <td>{props.airportInfoObj.city ? props.airportInfoObj.city : <span className="notAvailableEntry">Entry not available</span>}</td>
            <td>{props.airportInfoObj.country ? props.airportInfoObj.country : <span className="notAvailableEntry">Entry not available</span>}</td>
        </tr></tbody>
    );
}

class AirportChooser extends Component {
    constructor() {
        super();
        this.tableHeadings = [{id: '001', value: 'Name'}, {id: '002', value: 'Code'}, {id: '003', value: 'City'}, {id: '004', value: 'Country'}];
        this.state = {
            showLoading : false,
            message: '',
            fullAirportList : [],
            paginatedAirportList : [],
            paginationObject : {
                recordsPerPage : 300,
                startIndexOfPage : 0,
                endIndexOfPage : 300
            }
        };
    }

    render() {
        return (
            <Fragment>
                {this.state.paginatedAirportList.length === 0 ? <button className="fetchAirportListBtn" onClick={() => this.fetchAirportsList(this.props.url)}>Fetch Airports</button> : null}
                <div>
                    {this.state.message !== '' ? <p>{this.state.message}</p> : ''}
                    {this.state.showLoading && this.state.paginatedAirportList.length === 0 && this.state.message === ''? <div className="loaderContainer"><div className="loader"></div></div> : ''}
                    {this.state.paginatedAirportList.length !== 0 ? <div className='airportListContainer' onScroll={(event)=> {this.onScrollTable(event)}}>
                        <table> 
                            <thead>
                                <tr>
                                    {this.tableHeadings.map((item)=>{
                                        return <th key={item.id}>{item.value}</th>
                                    })} 
                                </tr>
                            </thead>

                            {this.state.paginatedAirportList.map(  (item, index) => {
                                return <AirportInformation highlightedRow={index % 2 === 0} key={item.randomKey} airportInfoObj={item}/>
                            })}
                        </table> </div> : null }
                </div>
            </Fragment>
        );
    }

    onScrollTable(event) {
        if(event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && this.state.paginationObject.endIndexOfPage <= this.state.fullAirportList.length) {
            this.fetchNextRecords();
        } else if(event.target.scrollTop === 0 && this.state.paginationObject.startIndexOfPage > 0) {
            this.fetchPreviousRecords();
            event.target.scrollTop = event.target.offsetHeight;
        }
    }

    fetchNextRecords() {
        let fullAirportList = Object.assign([], this.state.fullAirportList);
        let paginationObject = Object.assign({}, this.state.paginationObject);
        let newState = utilsSingletonObject.getNextPrevRecordOnScroll(paginationObject, fullAirportList, 'next');
        this.setState(newState);
    }

    fetchPreviousRecords() {
        let fullAirportList = Object.assign([], this.state.fullAirportList);
        let paginationObject = Object.assign({}, this.state.paginationObject);
        let newState = utilsSingletonObject.getNextPrevRecordOnScroll(paginationObject, fullAirportList, 'prev');
        this.setState(newState);
    }

    async fetchAirportsList(url) {
        let showLoading = this.state.showLoading;
        showLoading = true;
        this.setState({showLoading : showLoading});
        let fullAirportList = await utilsSingletonObject.fetchAirportList(url);
        if(fullAirportList.type === 'error') {
            let message = `Problem in fetching list : ${fullAirportList.message}`;
            showLoading = false;
            this.setState({message : message});
            return;
        }
        let paginationObject = Object.assign({}, this.state.paginationObject);
        let paginatedAirportList = fullAirportList.slice(0, paginationObject.recordsPerPage);
        showLoading = false;
        this.setState({showLoading : showLoading,fullAirportList : fullAirportList, paginatedAirportList : paginatedAirportList, paginationObject : paginationObject});
    }
}

export default AirportChooser;