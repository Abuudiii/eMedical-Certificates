import React from 'react';
import axios from 'axios';

class CreateRecord extends React.Component {
    state = {
        patientID: '',
        recordData: '',
        result: ''
    }

    handlePatientIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    handleRecordDataChange = event => {
        this.setState({recordData: event.target.value});
    }

    createRecord = event => {
        event.preventDefault();
        console.log('Creating record');
        axios.get(`http://localhost:3001/health-data-provider/${this.props.operatorID}-${this.props.channelName}/createRecord?patient-id=${this.state.patientID}&record-data=${this.state.recordData}`,
                {crossDomain: true}).then(
                    res => {
                        this.setState({result: 'Result: ' + JSON.stringify(res.data)});
                    }
                )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.createRecord}>
                    <label for='patientID'>Patient ID: </label>
                    <input type='text' id='patientID' name='patientID' onChange={this.handlePatientIDChange}></input>
                    <label for='recordData'>Record Data: </label>
                    <input type='text' id='recordData' name='recordData' onChange={this.handleRecordDataChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }

}

export default CreateRecord;