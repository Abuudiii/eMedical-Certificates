import React from 'react';
import axios from 'axios';

class GetRecordByID extends React.Component {
    state = {
        patientID: '',
        recordID: '',
        result: ''
    }

    handleRecordIDChange = event => {
        this.setState({recordID: event.target.value});
    }

    handlePatientIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    getRecordByID = event => {
        event.preventDefault();
        console.log('Getting record by ID');
        axios.get(`http://localhost:3001/health-data-provider/${this.props.operatorID}-${this.props.channelName}/getRecordByID?id=${this.props.operatorID}&patient-id=${this.state.patientID}&record-id=${this.state.recordID}`,
                {crossDomain: true}).then(
                    res => {
                        this.setState({result: 'Result: ' + JSON.stringify(res.data)});
                    }
                );
    }


    render() {
        return (
            <div>
                <form onSubmit={this.getRecordByID}>
                    <label for='patientID'>Patient ID: </label>
                    <input type='text' id='patientID' name='patientID' onChange={this.handlePatientIDChange}></input>
                    <label for='recordID'>Record ID: </label>
                    <input type='text' id='recordID' name='recordID' onChange={this.handleRecordIDChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }
};

export default GetRecordByID;