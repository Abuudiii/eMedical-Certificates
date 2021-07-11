import React from 'react';
import axios from 'axios';

class UpdateRecord extends React.Component {
    state = {
        patientID: '',
        recordID: '',
        recordData: '',
        result: ''
    }

    handleRecordIDChange = event => {
        this.setState({recordID: event.target.value});
    }

    handlePatientIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    handleRecordDataChange = event => {
        this.setState({recordData: event.target.value});
    }

    updateRecord = event => {
        event.preventDefault();
        console.log('Updating record');
        axios.get(`http://localhost:3001/health-data-provider/${this.props.operatorID}-${this.props.channelName}/updateRecord?&patient-id=${this.state.patientID}&record-id=${this.state.recordID}&new-record-data=${this.state.recordData}`,
                {crossDomain: true}).then(
                    res => {
                        this.setState({result: 'Result: ' + JSON.stringify(res.data)});
                    }
                )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.updateRecord}>
                    <label for='patientID'>Patient ID: </label>
                    <input type='text' id='patientID' name='patientID' onChange={this.handlePatientIDChange}></input>
                    <label for='recordID'>Record ID: </label>
                    <input type='text' id='recordID' name='recordID' onChange={this.handleRecordIDChange}></input>
                    <label for='recordData'>Record Data: </label>
                    <input type='text' id='recordData' name='recordData' onChange={this.handleRecordDataChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }
};

export default UpdateRecord;